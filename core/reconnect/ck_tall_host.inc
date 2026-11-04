/* ChronoKi tall rendering: the gate, the frame size and the wrap (docs/plans/tall-rendering-engine-patch.md). Included by the
   patched field.c right before hostUploadPictureAt (wasm-build/patches/tall-field.mjs).
   hostTallT: the band rows a side the option asks for; 0 = off (headless: the suite, the oracle; or tall_lines unset /
   224). It combines with the widescreen: the picture is then wide_width x tall_lines.
   ckTallWrap: hostUpload's first step. Every picture (any scene, at the internal scale k, a frame between or the frame
   itself) goes up as w x (h + 2 T k): the picture unchanged in the middle, the band rows above and below it from
   (a) the title's mode 7, drawn for those rows (CkTitleIntroRenderBands, ck_tall_title.inc);
   (b) the band store a producer filled for the frame being shown (the field, the overworld, a battle), nearest-scaled to
       k, at the store's brightness, and in a frame between moved by the camera's shift at t as the picture's own
       frames between move the map (the store's CK_TALL_EDGE margin rows are what a shifted band row reads);
   (c) black: a menu, a sequence's stage, game over, loading, a title phase that is not mode 7.
   With the option off it returns the picture as it was: the upload is the original one. */
static int hostTallT(void) {
  if (!g_hostInteractive) return 0;
  const int lines = ck_tall_lines();
  return lines > CAMH && lines <= CK_FIELD_HMAX ? (lines - CAMH) / 2 : 0;
}
int ck_tall_rows(void) { return hostTallT(); }
/* the 1x picture size the core reports to the host (ck_api.c CkViewWidth / CkViewHeight); the frame is k times it */
void ck_view_size(int* w, int* h) { *w = hostWideW(); *h = CAMH + 2 * hostTallT(); }
static int g_ckUpT = 256;   /* the upload's t (hostUploadPictureAt's): 256 = the frame itself, less = a frame between */
/* the present's start (hostPresentMot): the bands a producer stored this frame are the ones shown; a present no producer
   filled (a menu, a sequence, game over) shows black. The pause redraw uploads again without a present: it keeps them. */
static void ckTallPresentBegin(void) { g_ckBandLive = g_ckBandPending; g_ckBandPending = 0; }
int CkTitleIntroRenderBands(const CtTitleIntro* t, const struct CtTiLatch* prev, int t256, unsigned char* top,
                            unsigned char* bottom, int w1, int x0, int T, int k);
static uint8_t* g_ckWrap; static size_t g_ckWrapN;
static int g_ckXmap[FIELD_WMAX * 4];
static const uint8_t* ckTallWrap(const uint8_t* pic, int w, int* h) {
  const int upT = g_ckUpT;   /* this upload's t; an upload not through hostUploadPictureAt is a frame itself */
  g_ckUpT = 256;
  const int T = hostTallT();
  if (!T || *h < CAMH || *h % CAMH) return pic;
  const int k = *h / CAMH;
  if (k < 1 || k > 4 || w % k || w > FIELD_WMAX * 4) return pic;
  const int W1 = w / k, Tk = T * k, H = *h + 2 * Tk;
  const size_t row = (size_t)w * 3, n = row * (size_t)H;
  if (g_ckWrapN < n) { free(g_ckWrap); g_ckWrap = (uint8_t*)malloc(n); g_ckWrapN = g_ckWrap ? n : 0; }
  if (!g_ckWrap) return pic;
  uint8_t* out = g_ckWrap;
  uint8_t* top = out; uint8_t* bot = out + (size_t)(Tk + *h) * row;
  memcpy(out + (size_t)Tk * row, pic, row * (size_t)*h);
  *h = H;
  if (g_hostTi) {   /* (a) the title: its mode 7 goes on past the view; its other modes have no rows there */
    if (!CkTitleIntroRenderBands(g_hostTi, g_hostTiPrevOk ? &g_hostTiPrev : NULL, upT, top, bot, W1, (W1 - CAMW) / 2, T, k)) {
      memset(top, 0, (size_t)Tk * row); memset(bot, 0, (size_t)Tk * row); }
    return out;
  }
  const int BW = g_ckBandW;
  if (!g_ckBandLive || g_ckBandT != T || BW < 1 || BW > W1) {   /* (c) no rows to show */
    memset(top, 0, (size_t)Tk * row); memset(bot, 0, (size_t)Tk * row);
    return out;
  }
  /* (b) the store. A frame between: the camera's shift at t (CtMotCamShift, as the frames between draw the view), only
     between two frames of one scene at one width whose camera moved at most 32 (else the frame's own bands, unmoved). */
  double dx = 0, dy = 0;
  if (upT < 256 && BW == W1) {
    const CtMotFrame* cur = &g_motBuf[g_motIdx]; const CtMotFrame* prev = &g_motBuf[g_motIdx ^ 1];
    if (cur->valid && prev->valid && cur->scene == prev->scene && cur->w == W1 && prev->w == W1) {
      const int ow = (cur->scene & 0x10000) != 0;
      int dcx = cur->camX - prev->camX, dcy = cur->camY - prev->camY;
      if (ow) { dcx = owWrapD(dcx, 1536); dcy = owWrapD(dcy, 1024); }
      if (abs(dcx) <= CK_TALL_EDGE && abs(dcy) <= CK_TALL_EDGE) {
        CtMotCamShift(cur, prev, upT / 256.0, dcx, dcy, &dx, &dy);
        if (fabs(dx) > CK_TALL_EDGE || fabs(dy) > CK_TALL_EDGE) dx = dy = 0;
      }
    }
  }
  const int bx0 = (W1 - BW) / 2;   /* a narrower store (a 256 battle in a wide picture): centred, black sides */
  for (int X = 0; X < w; X++) {
    int sx = (int)floor((X + 0.5) / k + dx) - bx0;
    if (BW == W1) sx = sx < 0 ? 0 : sx >= BW ? BW - 1 : sx;
    g_ckXmap[X] = sx >= 0 && sx < BW ? sx : -1;
  }
  uint8_t lut[256];
  for (int i = 0; i < 256; i++) lut[i] = (uint8_t)(i * g_ckBandBright / 15);
  for (int side = 0; side < 2; side++) {
    uint8_t* o0 = side ? bot : top;
    const int lo = side ? CAMH - CK_TALL_EDGE : -T, hi = side ? CAMH + T - 1 : CK_TALL_EDGE - 1;
    for (int Y = 0; Y < Tk; Y++) {
      uint8_t* o = o0 + (size_t)Y * row;
      const double yv = (side ? CAMH : -T) + (Y + 0.5) / k;
      int sy = (int)floor(yv + dy);
      sy = sy < lo ? lo : sy > hi ? hi : sy;
      const uint8_t* s = ckBandRow(sy);
      if (!s || g_ckBandBright <= 0) { memset(o, 0, row); continue; }
      for (int X = 0; X < w; X++, o += 3) {
        const int m = g_ckXmap[X];
        if (m < 0) { o[0] = o[1] = o[2] = 0; continue; }
        const uint8_t* p = s + (size_t)m * 3;
        o[0] = lut[p[0]]; o[1] = lut[p[1]]; o[2] = lut[p[2]];
      }
    }
  }
  return out;
}
