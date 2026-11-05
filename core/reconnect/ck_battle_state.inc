/* Appended to the patched battle.c (core/wasm-build/patches/sightscope.mjs): hands the battle section the address of each
   static in ck_battle_statics.h, which only this translation unit can name, and clears the line cuts after a load. Called at
   the safe point (ck_battle_table.inc, ck_battle_load.inc). */
#include "ck_reconnect.h"

int ckBattleStatics(CkPtrField* out, int max) {
  int n = 0;
#define CK_BSTAT(x) if (n < max) { out[n].name = "battle." #x; out[n].ptr = (void*)&x; out[n].size = (uint32_t)sizeof x; n++; }
#define CK_BGLOB(x) CK_BSTAT(x)
#include "ck_battle_statics.h"
#undef CK_BGLOB
#undef CK_BSTAT
  return n;
}

/* The line cuts (gBattleFxCutN, the copies of WRAM the NMI's raster waits left for this frame's compose) are scratch: the
   next tick's NMI service clears them before it cuts again. A load drops the running game's, so a compose before that
   tick never reads copies of another WRAM. */
void ckBattleAfterLoad(void) {
  gBattleFxCutN = 0;
  gBattleLineCutOn = 0; gBattleLineAt = 0;
  g_fxTeardownPreNmi = 0;
}
