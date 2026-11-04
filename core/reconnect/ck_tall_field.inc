/* ChronoKi tall rendering: the field's band rows (docs/plans/tall-rendering-engine-patch.md). Included by the patched field.c
   right after fieldBaseAt (wasm-build/patches/tall-field.mjs). Everything here runs only while g_ft > 0 (the compositor,
   tall on); the callers test it.
   `fb` and `front` are the compositor's pointers: row 0 is the view's first row, rows -g_ft..-1 the top band and
   CAMH..CAMH+g_ft-1 the bottom one. `camy` is the map row the view's row 0 shows (the compose's camy, after its +1 line
   and the bottom lines' hold). */

/* The room's rows (the scroll mask, Field.my0 / my1). Past them the map holds other rooms, or wraps to its own top (the
   SNES never shows those rows: its camera stops at the mask and its V-IRQ blanks 211-223), so the bands show black there.
   A mask taller than the map is the camera wrapping the map itself: no edge (fieldWideMask's rule, on the other axis). */
static int ckTallInRoom(const Field* f, int my) {
  if (f->my1 <= f->my0 || f->my1 - f->my0 > f->H) return 1;
  return my >= f->my0 && my < f->my1;
}
/* The rows the SNES blanks (211-223) are part of the tall picture (the blank is not applied, as with the bottom lines
   drawn); there, as in the bands, a row past the room is black. 1 = the compositor's view row y shows black. */
static int ckTallBlackRow(const Field* f, int camy, int y) {
  return g_ft && y >= 211 && y < CAMH && !ckTallInRoom(f, camy + y);
}
/* The map in the bands (the bake: every layer, as the view's base pass draws it, without the battle's row shifts), black
   past the room; and black on the view's blanked rows past the room. Before the sprites, which draw over both. */
static void ckTallMap(const Field* f, uint8_t* fb, int camx, int camy) {
  for (int y = -g_ft; y < CAMH + g_ft; y++) {
    uint8_t* row = fb + (ptrdiff_t)y * g_fw * 3;
    if (y >= 0 && y < CAMH) { if (ckTallBlackRow(f, camy, y)) memset(row, 0, (size_t)g_fw * 3); continue; }
    if (!ckTallInRoom(f, camy + y)) { memset(row, 0, (size_t)g_fw * 3); continue; }
    for (int x = 0; x < g_fw; x++) memcpy(row + (size_t)x * 3, f->base + fieldBaseAt(f, camx + x, camy + y) * 3, 3);
  }
}
/* The foreground in the bands: BG1/BG2 priority-1 pixels over the sprites, except where a priority-3 sprite half is in
   front (`front`, which drawSprite fills in the bands too). The view's rows are the compositor's own pass. */
static void ckTallFg(const Field* f, uint8_t* fb, const uint8_t* front, int camx, int camy) {
  for (int y = -g_ft; y < CAMH + g_ft; y++) {
    if (y == 0) { y = CAMH - 1; continue; }
    if (!ckTallInRoom(f, camy + y)) continue;
    for (int x = 0; x < g_fw; x++) {
      const size_t bo = fieldBaseAt(f, camx + x, camy + y);
      if (!f->prio[bo] || front[(ptrdiff_t)y * g_fw + x]) continue;
      memcpy(fb + ((ptrdiff_t)y * g_fw + x) * 3, f->base + bo * 3, 3);
    }
  }
}
/* The frame shown: the tall picture's bands (`wpic`, its row 0 the top band's first) under the frame's brightness around
   the finished 256 x 224 view (`view`: the compositor's rows after the box, the wipe and the fade drew on them). The wipe's
   curtain goes on through each band at its nearest view row's edges. `out` is 256 x (224 + 2t). */
static void ckTallAssemble(uint8_t* out, const uint8_t* wpic, const uint8_t* view, int t, int bright) {
  const int H = CAMH + 2 * t;
  const size_t row = (size_t)CAMW * 3;
  for (int Y = 0; Y < H; Y++) {
    uint8_t* o = out + (size_t)Y * row;
    const int y = Y - t;
    if (y >= 0 && y < CAMH) { memcpy(o, view + (size_t)y * row, row); continue; }
    const uint8_t* s = wpic + (size_t)Y * row;
    if (bright <= 0) { memset(o, 0, row); continue; }
    if (bright >= 15) memcpy(o, s, row);
    else for (size_t i = 0; i < row; i++) o[i] = (uint8_t)(s[i] * bright / 15);
    const int e = y < 0 ? 0 : CAMH - 1;
    if (!g_wipeOn[e]) continue;
    int l = g_wipeL[e], r = g_wipeR[e];
    if (l < 0) l = 0;
    if (r > CAMW - 1) r = CAMW - 1;
    uint8_t bd[3];
    for (int c = 0; c < 3; c++) bd[c] = (uint8_t)(bright >= 15 ? g_wipeBd[c] : g_wipeBd[c] * bright / 15);
    for (int x = l; x <= r; x++) memcpy(o + (size_t)x * 3, bd, 3);
  }
}
