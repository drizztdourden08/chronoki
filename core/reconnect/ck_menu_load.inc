/* The menu half of the load, first (included at the top of ck_host_point.inc's CK_OP_LOAD branch, inside main()). Builds the MENU
   record table (ckMt / ckMn). A state taken with a menu open is checked strictly before anything is touched: the MENU section
   must hold exactly this build's records, and it must have a HOST section and the caller's stash. A refusal (ckMenuOk = 0)
   leaves the running game untouched: the load fails. Then the underlying mode is entered from the WRAM the menu was opened
   over: the state's CORE with the menu-owned ranges put back from the stash (the field's $0920-1DFF, or the overworld's six
   blocks, as the menu's own close does), so fieldLoad / worldInit never see the menu's scratch. ck_menu_finish.inc overlays the
   menu afterwards. */
#include "ck_menu_table.inc"
if (ck_state_load_has_menu()) {
  const uint8_t* ckC = ck_state_load_core();
  ckMenuOk = ckC && ck_state_load_menu_check(ckMt, ckMn) && ck_state_load_host(&ckHost, ckHostFields, CK_HOST_COUNT)
    && ck_state_load_menu_get("menu.stash", ckStashBuf, CK_M_STASH_BYTES) && (ckHost.menuStashOw == 0 || ckHost.menuStashOw == 1);
  if (ckMenuOk) {
    memcpy(ckEntryBuf, ckC, CK_STATE_WRAM_BYTES);
    if (ckHost.menuStashOw == 0) memcpy(ckEntryBuf + 0x0920, ckStashBuf, 0x14E0);
    else {
      size_t ckO = 0;
      for (int ckK = 0; ckK < 6; ckK++) { memcpy(ckEntryBuf + kOwStash[ckK].at, ckStashBuf + ckO, kOwStash[ckK].len); ckO += kOwStash[ckK].len; }
    }
    ckEntry = ckEntryBuf;
  }
}
