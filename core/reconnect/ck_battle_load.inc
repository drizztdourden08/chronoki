/* The battle half of the load, first (included in ck_host_point.inc's CK_OP_LOAD branch, inside main(), after ck_menu_load.inc).
   A state taken in a fight is checked strictly before anything is touched: the BATL section must hold exactly this build's
   records, the state must carry HOST with the fight on (battlePhase), and neither MENU nor WRLD (a fight runs over a field
   only). A refusal (ckBattleOk = 0) leaves the running game untouched: the load fails.
   Then the location is entered from the WRAM the field had before the fight: the state's CORE with the field's object page
   put back from C0/0918's copy at $7F:2000 (as C0/0905 does at the ack) and the field's map ($7E:3000..AFFF) put back from
   the copy taken at the fight's entry (g_ckBattleMap): the fight's own bytes there are its arena and its blocks. The scene,
   the fight's WRAM and HOST then come back as for a field state; ck_battle_finish.inc overlays BATL. */
int ckBattleOk = 1;
if (ck_state_load_has_battle()) {
  const uint8_t* ckC = ck_state_load_core();
  int ckSaved = 0;
  {
#include "ck_battle_table.inc"
    ckBattleOk = ckC && !ck_state_load_has_menu() && !ck_state_load_has_world() && ck_state_load_battle_check(ckBt, ckBn)
      && ck_state_load_host(&ckHost, ckHostFields, CK_HOST_COUNT) && ckHost.battlePhase
      && ck_state_load_battle_get("field.g_battleObjSaved", &ckSaved, (uint32_t)sizeof ckSaved);
  }
  if (ckBattleOk) {
    memcpy(ckEntryBuf, ckC, CK_STATE_WRAM_BYTES);
    if (ckSaved) memcpy(ckEntryBuf + 0x0920, ckC + 0x12000, 0x14E0);
    ckBattleOk = ck_state_load_battle_get("field.g_ckBattleMap", ckEntryBuf + 0x3000, (uint32_t)sizeof g_ckBattleMap);
    if (ckBattleOk) ckEntry = ckEntryBuf;
  }
}
