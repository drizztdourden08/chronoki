/* The menu half of the load, last (included in ck_host_point.inc just before ck_state_load_result): the underlying mode has been
   entered and its section and HOST restored, so the menu is overlaid on it: the menu-owned WRAM goes back (the real CORE, the
   stash ranges included), then the MENU records (mSave, the statics, the stash) and, over a field, the frozen frame from MPIC;
   menu.c's pointer into the WRAM is re-derived. menuFrozen is not stored: it is written when the close is asked, which the
   safe window never contains. */
if (ckMenuOk && ck_state_load_has_menu() && ckR) {
  memcpy(CtWramSys(fieldWram()), ck_state_load_core(), CK_STATE_WRAM_BYTES);
  ckR = ck_state_load_menu(ckMt, ckMn, f.vm ? menuFb : NULL, CK_M_FB_PIXELS);
  if (ckR) ckMenuAfterLoad(CtWramSys(fieldWram()));
}
