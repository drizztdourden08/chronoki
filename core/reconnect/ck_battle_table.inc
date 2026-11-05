/* The BATL section's record table, built where the objects are live (inside main(), the safe point): ckBt / ckBn. Included in
   a block of its own by ck_battle_save.inc and ck_battle_load.inc. liveHost is main()'s CtBattleHost; its pointers are never
   records. The addresses are stable, so one build serves the strict check and the write. */
CkPtrField ckBt[CK_B_TOTAL];
int ckBn = 0;
#define CK_BATTLE(m) ckBt[ckBn++] = (CkPtrField){ "bh." #m, (void*)&liveHost.m, (uint32_t)sizeof liveHost.m };
#include "ck_battle_fields.h"
#undef CK_BATTLE
#define CK_BFSTAT(name) ckBt[ckBn++] = (CkPtrField){ "field." #name, (void*)&name, (uint32_t)sizeof name };
#include "ck_battle_fstat.h"
#undef CK_BFSTAT
ckBn += ckBattleStatics(ckBt + ckBn, CK_B_TOTAL - ckBn);
