/* The overworld section's file-scope pieces in the patched field.c (included by ck_host_state.h, just before main()):
   - owIdle, the era placard's idle counter, was a function-local static deep in main()'s world branch, out of reach of the
     safe point; the build (state-patches.mjs) removes that declaration and this one stands in for it, same name and value;
   - the number of records the table below holds (ck_world_table.inc), counted from the three X-macro lists, so the array
     it fills is exact. */
#ifndef CK_WORLD_STATE_H
#define CK_WORLD_STATE_H
static int owIdle = 0;

enum {
  CK_W_FIELDS =
#define CK_WORLD(top, path) +1
#include "ck_world_fields.h"
#undef CK_WORLD
  ,
  CK_W_FSTATS =
#define CK_FSTAT(name) +1
#include "ck_world_fstat.h"
#undef CK_FSTAT
  ,
  CK_W_WSTATS =
#define CK_WSTAT(name) +1
#include "ck_world_statics.h"
#undef CK_WSTAT
  ,
  CK_W_TOTAL = CK_W_FIELDS + CK_W_FSTATS + CK_W_WSTATS + 1   /* + wd.vram */
};
#endif
