/* The BATL section's record count (docs/plans/save-state-anywhere-plan.md, phase 4), included by ck_host_state.h just before
   main(): the number of records ck_battle_table.inc fills, counted from the three X-macro lists so the array is exact. */
#ifndef CK_BATTLE_STATE_H
#define CK_BATTLE_STATE_H

enum {
  CK_B_FIELDS =
#define CK_BATTLE(m) +1
#include "ck_battle_fields.h"
#undef CK_BATTLE
  ,
  CK_B_FSTATS =
#define CK_BFSTAT(name) +1
#include "ck_battle_fstat.h"
#undef CK_BFSTAT
  ,
  CK_B_BSTATS =
#define CK_BSTAT(name) +1
#define CK_BGLOB(name) +1
#include "ck_battle_statics.h"
#undef CK_BSTAT
#undef CK_BGLOB
  ,
  CK_B_TOTAL = CK_B_FIELDS + CK_B_FSTATS + CK_B_BSTATS
};
#endif
