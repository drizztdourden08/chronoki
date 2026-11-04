/* The save-state safe point (docs/plans/save-state-anywhere-plan.md, phase 1). The build (core/wasm-build/state-patches.mjs)
   includes this file as the first statement of field.c's main loop, inside main(), where only main()'s frame is live and
   every pre-loop local is in scope by its own name. ck_state_top says whether a request is serviced on this pass:
   - save: the host locals are copied into CtHostState (ck_host_fields.h), the scene and the sound machine write
     themselves to "mem:scene" / "mem:apu" (ck_fopen), and ck_state.c assembles the container with a HOST section;
   - load: a state from another location (or from the overworld) first enters that location from the state's WRAM image
     the way a door commit does (fieldLoad, then the location entry's own steps), with no fade and no door walk; then the
     scene, the WRAM and the sound machine are restored and the HOST section is written back over the locals. A state
     with no HOST section (a converted v1 one) takes the player position the scene state carries.
   The _Static_asserts stop the build when upstream changes the type of a local the host section copies. */
{
#define CK_HOST(t, n, d) _Static_assert(__builtin_types_compatible_p(__typeof__(n), t d), "field.c changed the type of main()'s " #n);
#include "ck_host_fields.h"
#undef CK_HOST
  static CtHostState ckHost;
  int ckMode = (!selftest && f.vm && !battlePhase && !menuPhase && !inWorld && !gameOver && !fade && !pendKind) ? 1
             : (!selftest && !f.vm && inWorld && !battlePhase && !menuPhase && !fade && !pendKind) ? 2 : 0;
  int ckOp = ck_state_top(ckMode, fieldWram(), fieldSram());
  if (ckOp != CK_OP_NONE) {
#define CK_HOST(t, n, d) memcpy(&ckHost.n, &n, sizeof ckHost.n);
#include "ck_host_fields.h"
#undef CK_HOST
  }
  if (ckOp == CK_OP_SAVE) {
    double ckPlr[4] = { px, py, (double)pz, (double)pfac };
    int ckScene = f.vm ? CtSceneSaveState(f.vm, "mem:scene", ckPlr) : 0;
    if (g_fieldAudio) CtAudioSaveState(g_fieldAudio, "mem:apu");
    ck_state_save_done(f.vm ? ckScene : 1, ckScene, &ckHost, ckHostFields, CK_HOST_COUNT);
  } else if (ckOp == CK_OP_LOAD) {
    int ckLoc = CtSceneStateLoc("mem:scene", NULL), ckR = 0;
    if (ckLoc >= 0 && (ckLoc != scene || !f.vm)) {
      const uint8_t* ckCore = ck_state_load_core();
      if (ckCore) memcpy(CtWramSys(fieldWram()), ckCore, CK_STATE_WRAM_BYTES);
      fieldFree(&f);
      g_ctLzSpriteCycles = 0; g_arrivalFromSpawn = 1;
      if (fieldLoad(&assets, &f, ckLoc, NULL)) {
        scene = ckLoc; px = f.spawnX; py = f.spawnY; pfac = 0; pz = 1; inWorld = 0;
        if (f.vm) CtSceneLoadCameraEntry(f.vm, (int)px / 16, (int)py / 16);
        if (f.vm) fieldDoorListApply("load", frameNo);
        fieldPaletteText(CtWramSys(fieldWram()));
        fieldChestPrebumpWram(CtWramSys(fieldWram()), CtWramGlb(fieldWram()), scene, f.C.cw, f.C.ch);
        fieldEntryTilemapFill(&f, scene);
        fieldPassObjSlots();
        fieldArrivalTileMode(&f.C, px, py, f.vm);
      } else if (!inWorld && !fieldLoad(&assets, &f, scene, NULL)) running = 0;
    }
    if (ckLoc >= 0 && f.vm && scene == ckLoc) {
      double ckPlr[4];
      int ckIdx = tbLastIdx, ckTbl = tbLastTbl;
      ckR = CtSceneLoadState(f.vm, "mem:scene", ckPlr);
      if (ckR) {
        fieldMapFromWram(&f, CtSceneMem7E(f.vm), "ckload");
        if (g_fieldAudio) CtAudioLoadState(g_fieldAudio, "mem:apu");
      }
      if (ckR && ck_state_load_host(&ckHost, ckHostFields, CK_HOST_COUNT)) {
#define CK_HOST(t, n, d) memcpy(&n, &ckHost.n, sizeof ckHost.n);
#include "ck_host_fields.h"
#undef CK_HOST
        if (tbLastIdx != ckIdx || tbLastTbl != ckTbl) { tbLastIdx = -1; tbLastTbl = -2; }
      } else if (ckR == 2) {
        px = ckPlr[0]; py = ckPlr[1]; pz = (int)ckPlr[2]; pfac = (int)ckPlr[3];
      } else if (ckR == 1) {
        int ckPl, ckSp, ckAx, ckAy, ckFa;
        CtSceneActor(f.vm, CtScenePlayerObj(f.vm), &ckPl, &ckSp, &ckAx, &ckAy, &ckFa);
        px = ckAx; py = ckAy; pfac = ckFa; pz = CtSceneMem7E(f.vm)[0x0155] & 3;
      }
    }
    ck_state_load_result(ckR);
  }
}
