/* Appended to the patched world.c (core/wasm-build/state-patches.mjs): hands the overworld section the address of each static
   in ck_world_statics.h, which only this translation unit can name. Called at the safe point (ck_world_table.inc). */
#include "ck_reconnect.h"

int ckWorldStatics(CkPtrField* out, int max) {
  int n = 0;
#define CK_WSTAT(x) if (n < max) { out[n].name = "world." #x; out[n].ptr = (void*)&x; out[n].size = (uint32_t)sizeof x; n++; }
#include "ck_world_statics.h"
#undef CK_WSTAT
  return n;
}
