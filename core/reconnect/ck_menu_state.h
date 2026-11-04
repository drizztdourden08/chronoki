/* The MENU section's sizes (docs/plans/save-state-anywhere-plan.md, phase 3), included by ck_host_state.h just before main():
   - CK_M_STASH_BYTES: the caller's WRAM put aside for the menu (main()'s menuStash). The field keeps 0x14E0 bytes ($0920-1DFF),
     the overworld six blocks (kOwStash, 0x60F8 bytes); the section always holds the whole 0x60F8-byte buffer so its record has
     one size, and the HOST local menuStashOw says which half is meaningful;
   - CK_M_TOTAL: the number of records ck_menu_table.inc fills, counted from the X-macro lists so the array is exact.
   The field menu's frozen frame (menuFb) is not a record: it goes in the MPIC section, run-length coded. */
#ifndef CK_MENU_STATE_H
#define CK_MENU_STATE_H
#define CK_M_STASH_BYTES 0x60F8
#define CK_M_FB_PIXELS (256 * 224)

enum {
  CK_M_MSAVES =
#define CK_MSAVE(m) +1
#include "ck_menu_msave.h"
#undef CK_MSAVE
  ,
  CK_M_FSTATS =
#define CK_MFSTAT(name) +1
#include "ck_menu_fstat.h"
#undef CK_MFSTAT
  ,
  CK_M_MSTATS =
#define CK_MSTAT(name) +1
#include "ck_menu_statics.h"
#undef CK_MSTAT
  ,
  CK_M_TOTAL = CK_M_MSAVES + CK_M_FSTATS + CK_M_MSTATS + 2   /* + menu.charSelSet + menu.stash */
};
#endif
