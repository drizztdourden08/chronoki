/* The overworld half of the save (included in ck_host_point.inc's CK_OP_SAVE branch, inside main(), when the loop is in the
   overworld): the WRLD section's records from the live World, field.c's and world.c's statics and the VRAM
   (ck_world_table.inc), and the sound machine. The CORE section (WRAM) and HOST are the container's, as in the field. */
{
#include "ck_world_table.inc"
  ck_state_save_world(ckWt, ckWn);
}
if (menuPhase) {
#include "ck_menu_save.inc"
}
if (g_fieldAudio) CtAudioSaveState(g_fieldAudio, "mem:apu");
ck_state_save_done(1, 0, &ckHost, ckHostFields, CK_HOST_COUNT);
