/* The battle half of the save (included in ck_host_point.inc's CK_OP_SAVE branch, inside main(), in a fight): stages the BATL
   section (liveHost's records, field.c's and battle.c's statics). The fight runs inside the field's loop over a frozen scene,
   so the CORE (the fight's WRAM), SCEN, HOST and the sound are the field's, as without a fight. */
{
#include "ck_battle_table.inc"
  ck_state_save_battle(ckBt, ckBn);
}
