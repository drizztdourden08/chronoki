/* The menu half of the save (included in ck_host_point.inc's CK_OP_SAVE branches and in ck_world_save.inc when a menu is open, inside
   main()): stages the MENU section (mSave, the field.c and menu.c statics, the caller's stash) and, over a field, the MPIC
   section (menuFb, the frozen field frame the resume fade re-presents, run-length coded). The CORE and HOST sections and the
   underlying mode's own section (SCEN or WRLD) are the container's, as without a menu. */
{
#include "ck_menu_table.inc"
  ck_state_save_menu(ckMt, ckMn, f.vm ? menuFb : NULL, CK_M_FB_PIXELS);
}
