/* ChronoKi Edge Effect: the environment picture (edge_env_reconnect.c holds the buffer). Included by the patched field.c
   right after fieldWideAssemble (wasm-build/patches/edge-env.mjs); hostPresentMot calls ckEnvPresent.
   The host's border glow mirrors the frame's edge into the black past the room. Mirroring the shown frame carries the
   party, the NPCs and the text box into the border; this picture is the shown field frame with them taken out, from the
   frame's own motion record (motion.h), so it costs one pass over the picture and no second render:
     - a pixel the map's layers own (BG1 / BG2 / the map's BG3, behind or in front), a margin pixel (world != 0) and a
       compose pixel nothing covered: the shown pixel itself (colour math, iris and brightness as shown);
     - a sprite's pixel, a caption-plane pixel (BG3 the script writes: captions, not the map) and a compose pixel an
       overlay drew over (the box, a menu strip; CtMotSettle tagged it screen-fixed): the map canvas at the camera (the
       frames between's uncovered pixel, CtMotRaster's rule), black outside the scroll mask, at the frame's brightness;
     - a row the frame shows all black (the V-IRQ's blank lines, a fade at 0) stays black; the wipe's curtain stays.
   The tall picture's band rows come from ck_edge_env_bands.inc. Layout: the upload's (ckTallWrap's) at 1x, RGBA,
   w x (CAMH + 2T). Only a field frame (ck_view_scene) whose record is valid and as wide as the upload gets one; any
   other present publishes none and the host mirrors the frame itself, as before. With the host's effect off,
   ckEnvPresent returns at its first test. */
static inline uint8_t ckEnvDim(int v, int bright) {
  return (uint8_t)(bright >= 15 ? v : bright <= 0 ? 0 : v * bright / 15);
}
static int ckEnvRowBlack(const uint8_t* row, int w) {
  for (int i = 0; i < w * 3; i++) if (row[i]) return 0;
  return 1;
}
static void ckEnvBlackRow(uint8_t* out, int w) {
  for (int x = 0; x < w; x++, out += 4) { out[0] = out[1] = out[2] = 0; out[3] = 255; }
}
/* the map canvas under picture pixel (x, y): CtMotRaster's uncovered pixel at t = 256 */
static void ckEnvCanvas(const CtMotFrame* m, int x, int y, uint8_t* o) {
  const int ux = m->canvasX0 + x;
  if (!m->canvas || m->cW <= 0 || m->cH <= 0 || ux < m->mx0 || ux >= m->mx1) { o[0] = o[1] = o[2] = 0; return; }
  int cx = ux % m->cW; if (cx < 0) cx += m->cW;
  int cy = (m->canvasY0 + y) % m->cH; if (cy < 0) cy += m->cH;
  const uint8_t* s = m->canvas + ((size_t)cy * (size_t)m->cW + (size_t)cx) * 3;
  o[0] = ckEnvDim(s[0], m->bright); o[1] = ckEnvDim(s[1], m->bright); o[2] = ckEnvDim(s[2], m->bright);
}
/* a pixel that is not the environment: a sprite, the caption plane, or a compose pixel an overlay covered */
static int ckEnvActor(const CtMotFrame* m, size_t i, const uint8_t* shown) {
  const int own = m->own[i] & 0x7F;
  if (own >= CT_MOT_SPR || own == CT_MOT_CAPB || own == CT_MOT_CAPF) return 1;
  if (own != CT_MOT_FIXED || m->world[i]) return 0;
  const uint8_t* p = g_motPic + i * 3; const uint8_t* s = shown + i * 3;
  return ckEnvDim(p[0], m->bright) != s[0] || ckEnvDim(p[1], m->bright) != s[1] || ckEnvDim(p[2], m->bright) != s[2];
}
/* the wipe's curtain columns on view row e, scaled to a picture w wide (fieldWideAssemble's); l > r = none */
static void ckEnvWipeSpan(int e, int w, int* l, int* r) {
  *l = 1; *r = 0;
  if (e < 0 || e >= CAMH || !g_wipeOn[e]) return;
  *l = wideWipeEdge(g_wipeL[e], w); *r = wideWipeEdge(g_wipeR[e], w);
}
static void ckEnvViewRow(const CtMotFrame* m, const uint8_t* shown, int w, int y, uint8_t* out) {
  const uint8_t* srow = shown + (size_t)y * (size_t)w * 3;
  if (ckEnvRowBlack(srow, w)) { ckEnvBlackRow(out, w); return; }
  int l, r; ckEnvWipeSpan(y, w, &l, &r);
  for (int x = 0; x < w; x++, out += 4) {
    const size_t i = (size_t)y * (size_t)w + (size_t)x;
    out[3] = 255;
    if (!(x >= l && x <= r) && ckEnvActor(m, i, shown)) ckEnvCanvas(m, x, y, out);
    else { out[0] = srow[x * 3]; out[1] = srow[x * 3 + 1]; out[2] = srow[x * 3 + 2]; }
  }
}
/* band row y from the compose's capture (black when this frame has none), the curtain on it as ckTallWipe puts it */
static void ckEnvBandOut(int have, int y, int w, int bright, uint8_t* out) {
  const uint8_t* s = have ? ckEnvBandRow(y) : NULL;
  if (!s || bright <= 0) { ckEnvBlackRow(out, w); return; }
  int l, r; ckEnvWipeSpan(y < 0 ? 0 : CAMH - 1, w, &l, &r);
  for (int x = 0; x < w; x++, out += 4) {
    const uint8_t* p = (x >= l && x <= r) ? g_wipeBd : s + (size_t)x * 3;
    out[0] = ckEnvDim(p[0], bright); out[1] = ckEnvDim(p[1], bright); out[2] = ckEnvDim(p[2], bright); out[3] = 255;
  }
}
/* hostPresentMot: m the frame's record (valid already settled), shown the picture being presented, w its width */
static void ckEnvPresent(const CtMotFrame* m, const uint8_t* shown, int w) {
  if (!ck_edge_env_on()) return;
  const int T = hostTallT();
  const int haveBands = g_ckEnvBandPending && g_ckEnvBandW == w && g_ckEnvBandT == T;
  g_ckEnvBandPending = 0;
  if (!m->valid || m->w != w || w != hostWideW() || ck_view_scene() != 1 || !shown) { ck_edge_env_publish(0); return; }
  uint8_t* out = ck_edge_env_begin(w, CAMH + 2 * T);
  if (!out) { ck_edge_env_publish(0); return; }
  const size_t row = (size_t)w * 4;
  for (int y = -T; y < CAMH + T; y++) {
    uint8_t* o = out + (size_t)(y + T) * row;
    if (y < 0 || y >= CAMH) ckEnvBandOut(haveBands, y, w, m->bright, o);
    else ckEnvViewRow(m, shown, w, y, o);
  }
  ck_edge_env_publish(1);
}
