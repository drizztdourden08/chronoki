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
  /* I-103. A sequence (the title, the attract's stages, the race, the ending's, the gate warp) runs on machines a state
     does not carry (seq_*.c's and field.c's stage statics, the title's sound clock, g_stagePic), so a state taken inside
     one cannot resume it: such a save is held (and given up as "not now", the same rule as any unsafe window), and such
     a state is refused below before anything is touched. Loading FROM a sequence (the title after boot) stays allowed. */
  int ckSeqOn = seqOpen || raceOn || endOn || gwPhase;
  /* The field's transition brightness has a driver whenever it is below full: the door fade (fade 1 to 3, the load
     ramp, its hold), the drain of a latched change ($0117 bit 7), op 0xFF's own fade before a sequence or a gate warp
     (ffPro), the menu, game over and the stages. With none of them, every path that ends a fade leaves fadeBri at 15
     (field.c's ramp end, its skip, the world's entry) and the scene's own $0119 is what shows. A state taken with a lower
     fadeBri and no driver (the ramp cut by a sequence request, field.c's `loadRamp && CtSceneSequence >= 0` stop, then the
     request gone) would stay dim until the next door: the state boundary restores the invariant. */
#define CK_FADE_IDLE() (f.vm && !fade && !loadRamp && loadHold <= 0 && !pendKind && !menuPhase && !gameOver && !battlePhase \
    && !ckSeqOn && CtSceneSequence(f.vm) < 0 && CtSceneGateWarp(f.vm) < 0 && !(CtSceneMem7E(f.vm)[0x0117] & 0x80))
  int ckOp = ck_state_top((ckSeqOn && ck_state_save_pending()) ? 0 : ckMode, fieldWram(), fieldSram());
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
    if (ckHost.fadeBri < 15 && CK_FADE_IDLE()) ckHost.fadeBri = 15;   /* the stored copy only: the live frame is untouched */
    ck_state_save_done(f.vm ? ckScene : 1, ckScene, &ckHost, ckHostFields, CK_HOST_COUNT);
  } else if (ckOp == CK_OP_LOAD && ck_state_load_in_sequence()) {
    ck_state_load_refuse_mode();   /* taken inside a sequence: refused, nothing touched (I-103, above) */
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
        ckSeqOn = seqOpen || raceOn || endOn || gwPhase;
        if (fadeBri < 15 && CK_FADE_IDLE()) fadeBri = 15;   /* a state saved before the fix (I-103, above) */
      } else if (ckR == 2) {
        px = ckPlr[0]; py = ckPlr[1]; pz = (int)ckPlr[2]; pfac = (int)ckPlr[3];
      } else if (ckR == 1) {
        int ckPl, ckSp, ckAx, ckAy, ckFa;
        CtSceneActor(f.vm, CtScenePlayerObj(f.vm), &ckPl, &ckSp, &ckAx, &ckAy, &ckFa);
        px = ckAx; py = ckAy; pfac = ckFa; pz = CtSceneMem7E(f.vm)[0x0155] & 3;
      }
    }
#include "ck_menu_finish.inc"
    ck_state_load_result(ckR);
  }
#undef CK_FADE_IDLE
}
