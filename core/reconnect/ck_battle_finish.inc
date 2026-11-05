/* The battle half of the load, last (included in ck_host_point.inc after the scene and HOST are restored, before
   ck_menu_finish.inc). The location has been entered and the scene, the fight's WRAM, the sound and HOST (battlePhase on)
   restored; BATL is overlaid on them: liveHost's records, the field.c and battle.c statics. liveHost's pointers are the live
   scene's (the WRAM the fight reads), never stored: mem and glb are re-derived, frame and ctx are NULL as in an interactive
   fight. The field's picture and collision under the fight are read back from the fight's WRAM with the field's map as the
   fight's entry found it (g_ckBattleMap; fieldMapFromWram, as a field state's load does), keeping the fight's colour page
   (g_fieldCgram, a BATL record). battle.c's line cuts are dropped (ckBattleAfterLoad). */
if (ck_state_load_has_battle() && ckR) {
  {
#include "ck_battle_table.inc"
    ckR = f.vm && battlePhase && ck_state_load_battle(ckBt, ckBn);
  }
  if (ckR) {
    uint8_t* ckS = CtSceneMem7E(f.vm);
    liveHost.mem = ckS; liveHost.glb = CtSceneMemGlb(f.vm); liveHost.frame = NULL; liveHost.ctx = NULL;
    memcpy(ckEntryBuf, ckS, CK_STATE_WRAM_BYTES);
    memcpy(ckEntryBuf + 0x3000, g_ckBattleMap, sizeof g_ckBattleMap);
    {
      uint8_t ckCg[sizeof g_fieldCgram];
      memcpy(ckCg, g_fieldCgram, sizeof ckCg);
      fieldMapFromWram(&f, ckEntryBuf, "ckload-battle");
      memcpy(g_fieldCgram, ckCg, sizeof ckCg);
    }
    ckBattleAfterLoad();
  }
} else if (ckR && !battlePhase) {
  g_battleObjSaved = 0;   /* a state outside a fight, loaded during one: no field page waits at $7F:2000 */
}
