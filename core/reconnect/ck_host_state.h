/* CtHostState: the host mode machine, the locals field.c's main() keeps across frames (ck_host_fields.h), as one struct
   and its field table. The build (core/wasm-build/state-patches.mjs) includes this header in the patched copy of field.c
   just before main(), where the types the fields use (AnimPlay, CtMenuRepeat, CtMenuShop, CtTitleIntro) and TB_MAXPAUSE are
   defined; ck_host_point.inc fills the struct from the locals at the loop's safe point and writes it back after a load.
   ck_state.c walks the table: each field is written by name and size, never as a struct copy. */
#ifndef CK_HOST_STATE_H
#define CK_HOST_STATE_H
#include <stddef.h>
#include <stdint.h>
#include "ck_reconnect.h"
#include "ck_world_state.h"   /* owIdle, and the overworld section's record count */
#include "ck_menu_state.h"    /* the menu section's sizes */
#include "ck_battle_state.h"  /* the battle section's record count */

typedef struct CtHostState {
#define CK_HOST(t, n, d) t n d;
#include "ck_host_fields.h"
#undef CK_HOST
} CtHostState;

static const CkHostField ckHostFields[] = {
#define CK_HOST(t, n, d) { #n, (uint32_t)offsetof(CtHostState, n), (uint32_t)sizeof(((CtHostState*)0)->n) },
#include "ck_host_fields.h"
#undef CK_HOST
};

#define CK_HOST_COUNT ((int)(sizeof ckHostFields / sizeof ckHostFields[0]))
#endif
