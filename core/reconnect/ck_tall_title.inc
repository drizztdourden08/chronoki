/* ChronoKi tall rendering: the title's band rows (docs/plans/tall-rendering-engine-patch.md, T4). Appended to the build's
   copy of src/title_intro.c (wasm-build/patches/tall-field.mjs), so it reaches the renderer's own statics; field.c's
   ckTallWrap (ck_tall_host.inc) calls it for the rows above and below the title's 224.
   Mode 7 (the swing, the plane under the logo) goes on past the SNES's lines: each band row is the plane sampled as
   CtTitleIntroRenderEx samples a line, with the registers of the nearest line HDMA set (line 1 above, line 224 below:
   the line tables cover 224 lines only, so a per-line matrix holds its last value), at the same sub-pixel walk for the
   internal scale k and the same frames-between lerp. No sprites in the bands (the SNES draws none past its lines). Any
   other mode (the mode-2 logo, the tiled screens) has no rows there: 0, and the caller draws black. */
int CkTitleIntroRenderBands(const CtTitleIntro* t, const struct CtTiLatch* prev, int t256, unsigned char* top,
                            unsigned char* bottom, int w1, int x0, int T, int k) {
  if (!t || t->mode != 7 || T < 1 || w1 < 1 || w1 > 1024 || k < 1) return 0;
  const int W = w1 * k;
  if (t->l.bri & 0x80) { memset(top, 0, (size_t)T * k * W * 3); memset(bottom, 0, (size_t)T * k * W * 3); return 1; }
  const int bri = t->l.bri & 0x0F;
  TiLine L;   /* the same seed as CtTitleIntroRenderEx */
  memset(&L, 0, sizeof L);
  L.mode = t->mode; L.tm = t->tm; L.ts = t->ts; L.tmw = t->tmw; L.tsw = t->tsw;
  L.cgadsub = (uint8_t)(t->cgadsub & 0x3F);
  L.halfColor = t->halfColor; L.subtract = t->subtract; L.addSub = t->addSub;
  L.clipMode = t->clipMode; L.preventMath = t->preventMath;
  L.bg1sc = t->bg1sc; L.bg2sc = t->bg2sc; L.bg12nba = t->bg12nba; L.obsel = t->obsel;
  L.win1l = t->win1l; L.win1r = t->win1r; L.win2l = t->win2l; L.win2r = t->win2r;
  memcpy(L.win, t->win, sizeof L.win);
  L.bg1h = t->l.bg1h; L.bg1v = t->l.bg1v; L.bg3h = t->l.bg3h;
  for (int q = 0; q < 4; q++) L.m7[q] = t->l.m7[q];
  if (prev && t256 < 256) {   /* the frames between: the matrix and the scroll from the previous latch, as RenderEx */
    int dh = s13(t->l.bg1h) - s13(prev->bg1h), dv = s13(t->l.bg1v) - s13(prev->bg1v), jump = abs(dh) > 64 || abs(dv) > 64;
    for (int q = 0; q < 4; q++) if (abs(t->l.m7[q] - prev->m7[q]) > 0x80) jump = 1;
    if (!jump) {
      for (int q = 0; q < 4; q++) L.m7[q] = (int16_t)(t->l.m7[q] - (t->l.m7[q] - prev->m7[q]) * (256 - t256) / 256);
      L.bg1h = (uint16_t)(t->l.bg1h - dh * (256 - t256) / 256); L.bg1v = (uint16_t)(t->l.bg1v - dv * (256 - t256) / 256);
    }
  }
  TiLine first, last;
  TiHdmaRun run[8];
  tiHdmaInit(t, run);
  for (int y = 0; y < 224; y++) {
    tiHdmaRun(t, run, &L);
    L.y = y + 1;
    if (y == 0) first = L;
  }
  last = L;
  static uint8_t zero[2048];   /* no sprites: indexed from -x0 (tiGetPixelEx) to w1 (tiRowM7) */
  const uint8_t* z = zero + 1024;
  for (int side = 0; side < 2; side++) {
    const TiLine* Ly = side ? &last : &first;
    unsigned char* out = side ? bottom : top;
    const int y0 = side ? 224 : -T;
    if (Ly->mode != 7) { memset(out, 0, (size_t)T * k * W * 3); continue; }   /* HDMA left mode 7 at that edge */
    const int fast = !Ly->tmw && !Ly->tsw && !Ly->clipMode && !Ly->preventMath;
    for (int y = y0; y < y0 + T; y++) {
      const int line = y + 1;
      TiM7Start m0 = tiM7Starts(Ly, line), m1 = tiM7Starts(Ly, line + 1);
      for (int j = 0; j < k; j++) {
        unsigned char* row = out + (size_t)((y - y0) * k + j) * W * 3;
        long sxk = (long)m0.sx * k + (long)(m1.sx - m0.sx) * j, syk = (long)m0.sy * k + (long)(m1.sy - m0.sy) * j;
        if (fast) { tiRowM7(t, Ly, z, z, sxk, syk, k, x0, W, bri, row); continue; }
        for (int X = 0; X < W; X++) {
          long dx = (long)X - (long)x0 * k;
          int xv = (int)tiFloorDiv(dx, k), inView = xv >= 0 && xv < 256;
          int m7px = 0;
          long xp = tiFloorDiv(sxk + (long)Ly->m7[0] * dx, 256L * k), yp = tiFloorDiv(syk + (long)Ly->m7[2] * dx, 256L * k);
          if (xp >= 0 && xp < CT_M7_FIELD && yp >= 0 && yp < CT_M7_FIELD) {
            int tile = tiM7Tile((int)(yp >> 3), (int)(xp >> 3));
            if (tile < CT_TITLE_M7_TILES) m7px = ctTitleM7Chr[tile * 64 + (yp & 7) * 8 + (xp & 7)];
          }
          tiPixEx(t, Ly, xv, m7px, inView, z, z, bri, row + X * 3);
        }
      }
    }
  }
  return 1;
}
