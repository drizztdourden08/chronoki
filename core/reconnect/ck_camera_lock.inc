/* ChronoKi "Lock Camera to View": [video] camera_lock (ck_camera_lock). Included by the patched field.c right after
   ck_tall_field.inc (wasm-build/patches/camera-lock.mjs).
   The ROM clamps its camera to the location's scroll mask (Field.mx0 / my0 / mx1 / my1). A tall picture holds T rows above
   and below the view, and the rows the V-IRQ blanks (211-223) are drawn, so at a room's edge those rows show past the room
   (black). The lock moves the picture's origin so the tall picture's first and last rows are the room's: origin in
   [my0 + T, my1 - 224 - T], the midpoint when the room is shorter than the picture. The map and the objects move together
   (as fillHold does); the box and the screen-fixed overlays stay put. */
static int g_ckLockBlack[4], g_ckLockScene;                /* the shown frame's black rows / columns (top, bottom, left, right) and scene kind */
static int g_ckLockPendBlack[4], g_ckLockPendScene;        /* ...the compose's, shown at the next present (ckLockPresentBegin) */
static void ckLockPresentBegin(void) {
  memcpy(g_ckLockBlack, g_ckLockPendBlack, sizeof g_ckLockBlack);
  g_ckLockScene = g_ckLockPendScene;
  memset(g_ckLockPendBlack, 0, sizeof g_ckLockPendBlack); g_ckLockPendScene = 0;
}
static int ckLockHasEdgeRows(const Field* f) {
  return f->my1 > f->my0 && f->my1 - f->my0 <= f->H;
}
/* the origin shift (rows) that keeps the tall picture inside the room; *camy moves by it */
static int ckLockCam(const Field* f, int* camy, int T) {
  if (T <= 0 || !ck_camera_lock() || !ckLockHasEdgeRows(f)) return 0;
  const int lo = f->my0 + T, hi = f->my1 - CAMH - T;
  const int to = lo > hi ? (lo + hi) >> 1 : *camy < lo ? lo : *camy > hi ? hi : *camy;
  const int dy = to - *camy;
  *camy += dy;
  return dy;
}
/* the window rows (fillWinRowsHold's) for a signed shift of the map on screen: > 0 down, < 0 up */
static void ckWinRowsShift(int16_t* L, int16_t* R, int shift) {
  if (shift > 0) { fillWinRowsHold(L, R, shift); return; }
  const int up = -shift;
  if (up <= 0 || up >= CAMH) return;
  memmove(L, L + up, (size_t)(256 - up) * sizeof *L);
  memmove(R, R + up, (size_t)(256 - up) * sizeof *R);
  for (int y = 256 - up; y < 256; y++) { L[y] = L[255 - up]; R[y] = R[255 - up]; }
}
static int fieldWideExtSpan(const Field* f, int* lo, int* hi);
static int fieldBeyondLayers(void);
/* this frame's black extents, for the host: rows of the tall picture past the room (top, bottom) and picture columns past
   the room with no Steam margin or background (left, right). camx / camy: the picture's view origin (camy final). */
static void ckLockExtents(const Field* f, int wideW, int wideX, int camx, int camy, int T, int field) {
  memset(g_ckLockPendBlack, 0, sizeof g_ckLockPendBlack);
  g_ckLockPendScene = field ? 1 : 0;
  if (!field) return;
  if (ckLockHasEdgeRows(f)) {
    const int top = f->my0 - (camy - T), bot = camy + CAMH + T - f->my1;
    g_ckLockPendBlack[0] = top > 0 ? top : 0;
    g_ckLockPendBlack[1] = bot > 0 ? bot : 0;
  }
  if (wideW > CAMW && f->mx1 > f->mx0 && f->mx1 - f->mx0 <= f->W && !fieldBeyondLayers()) {
    int x0 = f->mx0, x1 = f->mx1, elo, ehi;
    if (fieldWideExtSpan(f, &elo, &ehi)) { if (elo < x0) x0 = elo; if (ehi > x1) x1 = ehi; }
    const int left = x0 - (camx - wideX), right = (camx - wideX + wideW) - x1;
    g_ckLockPendBlack[2] = left > 0 ? left : 0;
    g_ckLockPendBlack[3] = right > 0 ? right : 0;
  }
}
/* ck_api.c: CkViewBlackTop / Bottom / Left / Right (which 0..3) and CkViewScene, of the frame shown last */
int ck_view_black(int which) { return which >= 0 && which < 4 ? g_ckLockBlack[which] : 0; }
int ck_view_scene(void) { return g_ckLockScene; }
