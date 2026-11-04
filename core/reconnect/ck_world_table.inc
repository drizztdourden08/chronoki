/* The WRLD section's record table, built where the objects are live (inside main(), the safe point): ckWt / ckWn. Included in
   a block of its own by ck_world_point.inc, once before the load's world entry (names and sizes only, for the strict check)
   and once after it (wd.vram is a fresh allocation by then). */
CkPtrField ckWt[CK_W_TOTAL];
int ckWn = 0;
#define CK_WORLD(top, path) ckWt[ckWn++] = (CkPtrField){ "wd." #path, (uint8_t*)&wd + offsetof(World, path), (uint32_t)sizeof(((World*)0)->path) };
#include "ck_world_fields.h"
#undef CK_WORLD
#define CK_FSTAT(name) ckWt[ckWn++] = (CkPtrField){ "field." #name, (void*)&name, (uint32_t)sizeof name };
#include "ck_world_fstat.h"
#undef CK_FSTAT
ckWt[ckWn++] = (CkPtrField){ "wd.vram", wd.vram, 0x10000 };
ckWn += ckWorldStatics(ckWt + ckWn, CK_W_TOTAL - ckWn);
