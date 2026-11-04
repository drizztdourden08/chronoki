/* ChronoKi tall rendering: the field's and the battle's band rows (docs/plans/tall-rendering-engine-patch.md). Included by
   the patched field.c right after fieldBaseAt (wasm-build/patches/tall-field.mjs).
   The field compositor (g_ft > 0): `fb` and `front` are its pointers, row 0 the view's first row, rows -g_ft..-1 the top
   band and CAMH..CAMH+g_ft-1 the bottom one, g_fw columns (the widescreen's picture, or 256). `camx` / `camy` are the map
   pixel the picture's (0, 0) shows (the compose's camera: wideX further left in the widescreen). */

/* The room's rows (the scroll mask, Field.my0 / my1). Past them the map holds other rooms, or wraps to its own top (the
   SNES never shows those rows: its camera stops at the mask and its V-IRQ blanks 211-223), so the bands show black there.
   A mask taller than the map is the camera wrapping the map itself: no edge (fieldWideMask's rule, on the other axis). */
static int ckTallInRoom(const Field* f, int my) {
  if (f->my1 <= f->my0 || f->my1 - f->my0 > f->H) return 1;
  return my >= f->my0 && my < f->my1;
}
/* ...and its columns, for a band wider than 256 (the widescreen): past the room's side the band is black (the view's rows
   there are the widescreen's margins, which the bands do not draw). */
static int ckTallInCols(const Field* f, int mx) {
  if (g_fw <= CAMW || f->mx1 <= f->mx0 || f->mx1 - f->mx0 > f->W) return 1;
  return mx >= f->mx0 && mx < f->mx1;
}
/* The rows the SNES blanks (211-223) are part of the tall picture (the blank is not applied, as with the bottom lines
   drawn); there, as in the bands, a row past the room is black. 1 = the compositor's view row y shows black. */
static int ckTallBlackRow(const Field* f, int camy, int y) {
  return g_ft && y >= 211 && y < CAMH && !ckTallInRoom(f, camy + y);
}
/* The map in the bands (the bake: every layer, as the view's base pass draws it), black past the room; and black on the
   view's blanked rows past the room. Before the sprites, which draw over both. */
static void ckTallMap(const Field* f, uint8_t* fb, int camx, int camy) {
  for (int y = -g_ft; y < CAMH + g_ft; y++) {
    uint8_t* row = fb + (ptrdiff_t)y * g_fw * 3;
    if (y >= 0 && y < CAMH) { if (ckTallBlackRow(f, camy, y)) memset(row, 0, (size_t)g_fw * 3); continue; }
    if (!ckTallInRoom(f, camy + y)) { memset(row, 0, (size_t)g_fw * 3); continue; }
    for (int x = 0; x < g_fw; x++) {
      if (!ckTallInCols(f, camx + x)) { memset(row + (size_t)x * 3, 0, 3); continue; }
      memcpy(row + (size_t)x * 3, f->base + fieldBaseAt(f, camx + x, camy + y) * 3, 3);
    }
  }
}
/* The foreground in the bands: BG1/BG2 priority-1 pixels over the sprites, except where a priority-3 sprite half is in
   front (`front`, which drawSprite fills in the bands too). The view's rows are the compositor's own pass. */
static void ckTallFg(const Field* f, uint8_t* fb, const uint8_t* front, int camx, int camy) {
  for (int y = -g_ft; y < CAMH + g_ft; y++) {
    if (y == 0) { y = CAMH - 1; continue; }
    if (!ckTallInRoom(f, camy + y)) continue;
    for (int x = 0; x < g_fw; x++) {
      if (!ckTallInCols(f, camx + x)) continue;
      const size_t bo = fieldBaseAt(f, camx + x, camy + y);
      if (!f->prio[bo] || front[(ptrdiff_t)y * g_fw + x]) continue;
      memcpy(fb + ((ptrdiff_t)y * g_fw + x) * 3, f->base + bo * 3, 3);
    }
  }
}
/* The wipe's curtain on the stored rows: each row takes its nearest view row's window, its edges scaled to a wider picture
   as the widescreen's assembly scales them (wideWipeEdge's formula), in the backdrop colour (the store is before the
   brightness: the wrap dims it with the rest). */
static int ckTallWipeEdge(int e, int w) {
  return e <= 0 ? (e < 0 ? -1 : 0) : e >= CAMW - 1 ? (e >= CAMW ? w : w - 1) : (e * (w - 1) + (CAMW - 1) / 2) / (CAMW - 1);
}
static void ckTallWipe(void) {
  const int W = g_ckBandW, T = g_ckBandT;
  for (int y = -T; y < CAMH + T; y = ckBandNext(y)) {
    const int e = y < 0 ? 0 : y >= CAMH ? CAMH - 1 : y;
    if (!g_wipeOn[e]) continue;
    int l = g_wipeL[e], r = g_wipeR[e];
    if (W > CAMW) { l = ckTallWipeEdge(l, W); r = ckTallWipeEdge(r, W); }
    if (l < 0) l = 0;
    if (r > W - 1) r = W - 1;
    uint8_t* o = ckBandRow(y);
    for (int x = l; x <= r; x++) memcpy(o + (size_t)x * 3, g_wipeBd, 3);
  }
}
/* The field's producer: the compose drew the tall picture (`wpic`, its row 0 the top band's first: W x (CAMH + 2T)); its
   bands and margin rows (before the overlays: the box, a menu's strip stay the view's) go to the store, the wipe on them. */
static void ckTallFieldBands(const uint8_t* wpic, int W, int T, int bright) {
  if (!ckBandBegin(W, T)) return;
  for (int y = -T; y < CAMH + T; y = ckBandNext(y))
    memcpy(ckBandRow(y), wpic + (size_t)(y + T) * W * 3, (size_t)W * 3);
  ckTallWipe();
  ckBandEnd(bright);
}
/* The battle's producer: the arena (the field map) in the band rows, each side at the battle scroll of its nearest arena
   row (the shake, a line wave: arenaD / arenaRow as the view's base pass and the widescreen arena take them), black past
   the room; then the crit flash, as on the arena. W the picture's width (the widescreen arena's, or 256), x0 where the
   256 view stands in it, camy the map row the view's row 0 shows. Not in the bands: the combatants, BG3's effects, the
   flee mosaic (the SNES draws none of them past its 224 lines either way; the arena alone goes on). */
static void battleCritFlashRenderN(uint8_t* fb, size_t npx, const CtBattleHost* h);
static void ckTallBattleBands(const Field* f, int camx, int camy, const int16_t* arenaD, const uint8_t* arenaRow,
                              int arenaShift, int W, int x0, int T, int bright, const CtBattleHost* host) {
  if (!f->base || !ckBandBegin(W, T)) return;
  int d[2][2] = { { 0, 0 }, { 0, 0 } };
  if (arenaShift)
    for (int side = 0; side < 2; side++)
      for (int i = 0; i < CAMH; i++) {
        const int y = side ? CAMH - 1 - i : i;
        if (arenaRow[y] == 3) { d[side][0] = arenaD[y * 4]; d[side][1] = arenaD[y * 4 + 1]; break; }
      }
  for (int y = -T; y < CAMH + T; y = ckBandNext(y)) {
    uint8_t* o = ckBandRow(y);
    const int* dd = d[y >= CAMH / 2];
    const int my = camy + y + dd[1];
    if (!ckTallInRoom(f, my)) { memset(o, 0, (size_t)W * 3); continue; }
    for (int x = 0; x < W; x++) {
      const int mx = camx - x0 + x + dd[0];
      if (W > CAMW && f->mx1 > f->mx0 && f->mx1 - f->mx0 <= f->W && (mx < f->mx0 || mx >= f->mx1)) { memset(o + (size_t)x * 3, 0, 3); continue; }
      memcpy(o + (size_t)x * 3, f->base + fieldBaseAt(f, mx, my) * 3, 3);
    }
  }
  battleCritFlashRenderN(g_ckBand, (size_t)W * 2 * (T + CK_TALL_EDGE), host);
  ckBandEnd(bright);
}
