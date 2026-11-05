/* The save-state safe point (docs/plans/save-state-anywhere-plan.md, phase 1). The build (core/wasm-build/state-patches.mjs)
   includes this file as the first statement of field.c's main loop, inside main(), where only main()'s frame is live and
   every pre-loop local is in scope by its own name. ck_state_top says whether a request is serviced on this pass:
   - save: the host locals are copied into CtHostState (ck_host_fields.h), the scene and the sound machine write
     themselves to "mem:scene" / "mem:apu" (ck_fopen), and ck_state.c assembles the container with a HOST section; in the
     overworld there is no scene: ck_world_save.inc writes the WRLD section instead (phase 2);
   - load: a state from another location (or from the overworld) first enters that location from the state's WRAM image
     the way a door commit does (fieldLoad, then the location entry's own steps), with no fade and no door walk; then the
     scene, the WRAM and the sound machine are restored and the HOST section is written back over the locals. A state
     with no HOST section (a converted v1 one) takes the player position the scene state carries. A state with a WRLD
     section is the overworld's: ck_world_load.inc enters the world from its WRAM image and overlays WRLD and HOST.
   The overworld is a save point only when nothing of it is mid-flight: no fade or pending transition (as for the field), no
   inline-JSL pass suspension (owPassHold / owPassResume), no time-gauge or world-map sequence (owGaugePh / owMapPh), no exit
   wait and not the new-game pan. Those are unsafe windows: the request is held until they end (ck_state_top).
   The menu (phase 3) is mode 3 over a field and 4 over the overworld, but only on its settled screen (ckMenuSafe below): the
   state then also carries MENU (mSave, the menu statics, the caller's stash) and, over a field, MPIC (the frozen frame). The
   load enters the underlying mode from the CORE with the stash put back (ck_menu_load.inc), then overlays the menu
   (ck_menu_finish.inc). A MENU state that does not match this build exactly is refused before anything is touched.
   The picture after such an entry is baked once more, right after the entry fill: fieldLoad bakes the location's asset map
   before the object init, and the fill then rebuilds the layers from the WRAM map with obj0's slot-1 tile copies on it (loc
   002's curtains). A door's fade-in re-bakes through the colour page every frame; a load has no fade, the menu's close re-bakes
   nothing, and fieldMapFromWram below re-bakes only what the state's WRAM changes, so without it the field shows the asset map
   (stray tile strips, no curtains) from the first field frame on.
   The _Static_asserts stop the build when upstream changes the type of a local the host section copies. */
{
#define CK_HOST(t, n, d) _Static_assert(__builtin_types_compatible_p(__typeof__(n), t d), "field.c changed the type of main()'s " #n);
#include "ck_host_fields.h"
#undef CK_HOST
  static CtHostState ckHost;
  int ckOwSafe = haveWorld && wd.vram && wd.wram && !ngIntro && !owPassHold && !owPassResume && !owGaugePh && !owMapPh && !owExitWait;
  /* the menu is a save point only on its settled screen (phase 2, the entry fade up to full brightness) and only when none
     of its own multi-frame sequences is running: a screen or tab change being built, the Equip and Item slides and list
     climbs, the member slide, the Save screen's write and its holds, the exit and name fade-outs. The save-point, the
     load-list and the shop's build and quantity sub-states are unsafe too (a transaction or a reboot is in flight) and so
     are the exchange's and the naming screen's transitional sub-states: the request is held until they end. */
  int ckMenuSafe = menuPhase == 2 && !fade && !pendKind && menuBri == 15 && !menuFadeLive && menuOwStashT < 0
    && !menuEnterPending && !menuNameOut && !menuSavePtOn && !menuLoaderOn && menuRibbonWait <= 0 && menuMemSlide <= 0
    && menuEqSlide < 0 && menuEqExit < 0 && menuEqListRise < 0 && !menuEqListFall && !menuEqRowsHold && !menuEqListFresh
    && !menuEqA45D && !menuEqLRYield && !menuEqSlideStep && !menuItemSlideStep && !menuItemAAFF && !menuSaveDoWrite
    && !menuSaveRowsHold && !menuSavePanelHold && !menuSavePromptHold
    && (!menuShopOn || (menuShop.sub >= 1 && menuShop.sub <= 3))
    && (!menuExchOn || menuExch68 == 1 || menuExch68 == 2) && (!menuNameOn || menuName68 == 1 || menuName68 == 2);
  int ckMode = (!selftest && f.vm && !battlePhase && !menuPhase && !inWorld && !gameOver && !fade && !pendKind) ? 1
             : (!selftest && !f.vm && inWorld && !battlePhase && !menuPhase && !fade && !pendKind && ckOwSafe) ? 2
             : (!selftest && f.vm && !battlePhase && !inWorld && !gameOver && ckMenuSafe && menuStashOw == 0) ? 3
             : (!selftest && !f.vm && inWorld && !battlePhase && ckOwSafe && ckMenuSafe && menuStashOw == 1) ? 4 : 0;
  int ckOp = ck_state_top(ckMode, fieldWram(), fieldSram());
  /* I-103 trace: every brightness and colour-math input of the field picture, one line at a save and on the load's pass
     plus the 8 passes after it, so a picture that differs after a load names the input that differs. Print only. */
  static int ckTraceLeft = 0;
#define CK_BRI_TRACE(tag, r) do { if (f.vm) { const uint8_t* ckW = CtSceneMem7E(f.vm); int ckMt = -1, ckSt = -1, ckMe = -1; \
      unsigned ckCs = 0, ckCh = 0; for (int ckI = 0; ckI < 0x200; ckI++) { ckCs += ckW[0x2200 + ckI]; ckCh += g_fieldCgram[ckI]; } \
      if (f.sd) CtFieldSceneScreenLayers(f.sd, &ckMt, &ckSt, &ckMe); \
      printf("ckbright %s: f%d loc %X r %d bright %d $0119 %02X fadeBri %d fade %d ramp %d hold %d ffPro %d menu %d/%d seq %d " \
             "battle %d go %d cold %d $0BE0 %02X $0121 %02X $0118 %02X $0139 %02X $0146 %02X $0BCA %02X $01BB %02X TM %02X TS %02X " \
             "bake %X/%X/%X bg3Plane %d colWin %d bgWin %d cgram %X/%X\n", tag, frameNo, scene, r, CtSceneBright(f.vm), ckW[0x0119], \
             fadeBri, fade, loadRamp, loadHold, ffPro, menuPhase, menuT, seqOpen, battlePhase, gameOver, coldResetHold, ckW[0x0BE0], \
             ckW[0x0121], ckW[0x0118], ckW[0x0139], ckW[0x0146], ckW[0x0BCA], ckW[0x01BB], ckW[0x11520], ckW[0x11521], ckMt, ckSt, \
             ckMe, g_bg3Plane, g_colWinOn, g_bgWinOn, ckCs, ckCh); } } while (0)
  if (ckTraceLeft > 0 && ckOp == CK_OP_NONE) { ckTraceLeft--; CK_BRI_TRACE("after", 0); }
  if (ckOp != CK_OP_NONE) {
#define CK_HOST(t, n, d) memcpy(&ckHost.n, &n, sizeof ckHost.n);
#include "ck_host_fields.h"
#undef CK_HOST
  }
  if (ckOp == CK_OP_SAVE && !f.vm) {
#include "ck_world_save.inc"
  } else if (ckOp == CK_OP_SAVE) {
    double ckPlr[4] = { px, py, (double)pz, (double)pfac };
    int ckScene = f.vm ? CtSceneSaveState(f.vm, "mem:scene", ckPlr) : 0;
    if (g_fieldAudio) CtAudioSaveState(g_fieldAudio, "mem:apu");
    if (menuPhase) {
#include "ck_menu_save.inc"
    }
    CK_BRI_TRACE("save", ckScene);
    ck_state_save_done(f.vm ? ckScene : 1, ckScene, &ckHost, ckHostFields, CK_HOST_COUNT);
  } else if (ckOp == CK_OP_LOAD) {
    int ckMenuOk = 1, ckR = 0;
    const uint8_t* ckEntry = NULL;
    static uint8_t ckEntryBuf[CK_STATE_WRAM_BYTES], ckStashBuf[CK_M_STASH_BYTES];
#include "ck_menu_load.inc"
    int ckLoc = (ck_state_load_has_world() || !ckMenuOk) ? -1 : CtSceneStateLoc("mem:scene", NULL);
    if (ck_state_load_has_world() && ckMenuOk) {
#include "ck_world_load.inc"
    }
    if (ckLoc >= 0 && (ckLoc != scene || !f.vm || menuPhase || ck_state_load_has_menu())) {
      const uint8_t* ckCore = ckEntry ? ckEntry : ck_state_load_core();
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
        if (f.sd) {
          int ckW = 0, ckH = 0; uint8_t* ckPrio = NULL;
          uint8_t* ckBase = CtFieldSceneBake(f.sd, &ckW, &ckH, &ckPrio);
          if (ckBase) { free(f.base); free(f.prio); f.base = ckBase; f.prio = ckPrio; f.W = ckW; f.H = ckH; } else free(ckPrio);
        }
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
#include "ck_menu_finish.inc"
    CK_BRI_TRACE("load", ckR); ckTraceLeft = 8;
    ck_state_load_result(ckR);
  }
#undef CK_BRI_TRACE
}
