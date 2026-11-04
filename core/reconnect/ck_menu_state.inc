/* Appended to the patched menu.c (core/wasm-build/state-patches.mjs): hands the MENU section the address of each static in
   ck_menu_statics.h, which only this translation unit can name, and the one pointer the section cannot store. Called at the
   safe point (ck_menu_table.inc). */
#include "ck_reconnect.h"

static int ckCharSelSet = 0;   /* g_charSelMem was set (it is always the field's WRAM, so only whether it was is stored) */

int ckMenuStatics(CkPtrField* out, int max) {
  int n = 0;
  ckCharSelSet = g_charSelMem != NULL;
#define CK_MSTAT(x) if (n < max) { out[n].name = "menu." #x; out[n].ptr = (void*)&x; out[n].size = (uint32_t)sizeof x; n++; }
#include "ck_menu_statics.h"
#undef CK_MSTAT
  if (n < max) { out[n].name = "menu.charSelSet"; out[n].ptr = (void*)&ckCharSelSet; out[n].size = (uint32_t)sizeof ckCharSelSet; n++; }
  return n;
}

void ckMenuAfterLoad(const uint8_t* wram) { g_charSelMem = ckCharSelSet ? wram : NULL; }
