/* ChronoKi tall rendering, the field (docs/plans/tall-rendering-engine-patch.md). Included by the patched field.c right after
   its FIELD_WMAX definition (wasm-build/patches/tall-field.mjs); never by the import itself.
   The field compositor keeps drawing its 224 view rows exactly as before. With tall on, the picture it draws into has
   g_ft band rows above and below the view: the compositor's pointers (the picture, the sprite-priority mask, the player
   mask) point at the view's first row inside buffers sized for the cap, so a band row is a row index below 0 or from 224
   on, and every view-row table (windows, HDMA rows, the wipe, the box) keeps its own indices. g_ft is 0 outside the
   compositor and always with the option off, and every patched site then reduces to the original code. */
#include <stddef.h>
#include "ck_reconnect.h"
#define CK_TALL_MAXT ((CK_TALL_LINES_MAX - CAMH) / 2)   /* band rows a side at the cap: 128 */
#define CK_FIELD_HMAX (CAMH + 2 * CK_TALL_MAXT)         /* the tall picture's most lines: 480 */
static int g_ft = 0;          /* band rows a side while the field compositor draws tall; 0 outside it */
static int g_ckTallT = 0;     /* this frame's band rows (the compose's g_ft), for the blank lines and the assembly */
static int g_ckShowH = CAMH;  /* the lines of the picture the frame hands to the present (CAMH + 2 g_ckTallT when tall) */
