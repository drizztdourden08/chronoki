/* ChronoKi tall rendering (docs/plans/tall-rendering-engine-patch.md). Included by the patched field.c right after its
   FIELD_WMAX definition (wasm-build/patches/tall-field.mjs); never by the import itself.
   Every scene keeps drawing its own 224-line picture (wide or not) through the whole pipeline: the motion record, the
   frames between, the internal scale and the presenter are the ones the gate-off build runs. Tall is the last step of the
   upload (ckTallWrap, ck_tall_host.inc): the picture gets T rows above and below it. Those rows come from the band store
   below, which a scene that has rows to show (the field, the overworld, a battle) fills while it composes; the title's
   mode 7 draws its own; any other picture gets black.
   The band store: W columns (the scene's picture width), the 1x rows [-T, E) on top and [CAMH - E, CAMH + T) below, view
   coordinates, before the frame's brightness. The E = CK_TALL_EDGE view rows each side are the margin a frame between
   reads when its camera shift carries the band onto the view's own edge rows. With the option off nothing here runs:
   g_ft, g_ckTallT stay 0 and every patched site is the original code. */
#include <stddef.h>
#include "ck_reconnect.h"
#define CK_TALL_MAXT ((CK_TALL_LINES_MAX - CAMH) / 2)   /* band rows a side at the cap: 128 */
#define CK_FIELD_HMAX (CAMH + 2 * CK_TALL_MAXT)         /* the tall picture's most lines: 480 */
#define CK_TALL_EDGE 32                                 /* the view rows stored past each band (a frame between's shift) */
#define CK_TALL_BROWS (CK_TALL_MAXT + CK_TALL_EDGE)     /* stored rows a side at the cap */
static int g_ft = 0;          /* band rows a side while the field compositor draws tall; 0 outside it */
static int g_ckTallT = 0;     /* this frame's band rows (the field compose's g_ft), for the blank lines and the bands */
static int g_ckTallW = CAMW;  /* the field compose's picture width (its g_fw), for the bands' copy */
/* the store: top block (rows -T .. E-1) then bottom block (rows CAMH-E .. CAMH+T-1), each W x (T + E) RGB */
static uint8_t g_ckBand[FIELD_WMAX * 2 * CK_TALL_BROWS * 3];
static int g_ckBandW = CAMW, g_ckBandT = 0, g_ckBandBright = 15;
static int g_ckBandPending = 0;   /* a producer filled the store this frame (the next present takes it) */
static int g_ckBandLive = 0;      /* the present being shown has bands (else black; the pause redraw keeps the last) */
/* The store's row for view row y (-T <= y < E or CAMH - E <= y < CAMH + T); NULL elsewhere. */
static uint8_t* ckBandRow(int y) {
  const int T = g_ckBandT, n = T + CK_TALL_EDGE;
  if (y >= -T && y < CK_TALL_EDGE) return g_ckBand + (size_t)(y + T) * g_ckBandW * 3;
  if (y >= CAMH - CK_TALL_EDGE && y < CAMH + T) return g_ckBand + ((size_t)n + (size_t)(y - (CAMH - CK_TALL_EDGE))) * g_ckBandW * 3;
  return NULL;
}
/* The stored rows in order: for (y = -T; y < CAMH + T; y = ckBandNext(y)). */
static int ckBandNext(int y) { y++; return y == CK_TALL_EDGE ? CAMH - CK_TALL_EDGE : y; }
/* A producer: the store's size for this frame (W the picture's width, T the band rows), then its rows, then ckBandEnd. */
static int ckBandBegin(int W, int T) {
  if (W < 1 || W > FIELD_WMAX || T < 1 || T > CK_TALL_MAXT) return 0;
  g_ckBandW = W; g_ckBandT = T;
  return 1;
}
static void ckBandEnd(int bright) {
  g_ckBandBright = bright < 0 ? 0 : bright > 15 ? 15 : bright;
  g_ckBandPending = 1;
}
