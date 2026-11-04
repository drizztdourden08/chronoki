/* The MENU section's record table, built where the objects are live (inside main(), the safe point): ckMt / ckMn. Included in a
   block of its own by ck_host_point.inc, on a save and at the top of a load (the pointers are stable, so one build serves the
   strict check and the write). menuStash is the heap buffer, mSave the anonymous-struct local of main(). */
CkPtrField ckMt[CK_M_TOTAL];
int ckMn = 0;
#define CK_MSAVE(m) ckMt[ckMn++] = (CkPtrField){ "menu.mSave." #m, (void*)&mSave.m, (uint32_t)sizeof mSave.m };
#include "ck_menu_msave.h"
#undef CK_MSAVE
#define CK_MFSTAT(name) ckMt[ckMn++] = (CkPtrField){ "field." #name, (void*)&name, (uint32_t)sizeof name };
#include "ck_menu_fstat.h"
#undef CK_MFSTAT
ckMt[ckMn++] = (CkPtrField){ "menu.stash", menuStash, CK_M_STASH_BYTES };
ckMn += ckMenuStatics(ckMt + ckMn, CK_M_TOTAL - ckMn);
