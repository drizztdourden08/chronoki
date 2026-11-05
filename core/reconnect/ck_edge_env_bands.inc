/* ChronoKi Edge Effect: the tall picture's band rows for the environment picture. Included by the patched field.c right
   after ck_camera_lock.inc (wasm-build/patches/edge-env.mjs); never by the import itself.
   The bands have no motion record (it covers the 224 view rows only), so their environment is taken where it is plain:
   the compositor's bands right after ckTallMap drew the map there (every map layer, black past the room) and before the
   sprites and the foreground draw over them. Before the brightness, as the band store. Runs only with the host's Edge
   Effect on (ck_edge_env_on) and a tall picture (g_ft); otherwise it returns at its first test. */
static uint8_t* g_ckEnvBand = NULL;
static size_t g_ckEnvBandN = 0;
static int g_ckEnvBandW = 0, g_ckEnvBandT = 0;
static int g_ckEnvBandPending = 0;   /* the compose captured this frame's bands (the present takes them) */

/* fb: the compositor's view row 0 (rows -T..-1 and CAMH..CAMH+T-1 are the bands), W its width */
static void ckEnvBandsCapture(const uint8_t* fb, int W, int T) {
  if (!ck_edge_env_on() || T < 1 || T > CK_TALL_MAXT || W < 1 || W > FIELD_WMAX) return;
  const size_t row = (size_t)W * 3, n = row * 2 * (size_t)T;
  if (g_ckEnvBandN < n) {
    free(g_ckEnvBand);
    g_ckEnvBand = (uint8_t*)malloc(n);
    g_ckEnvBandN = g_ckEnvBand ? n : 0;
  }
  if (!g_ckEnvBand) return;
  memcpy(g_ckEnvBand, fb - (ptrdiff_t)T * (ptrdiff_t)row, row * (size_t)T);
  memcpy(g_ckEnvBand + row * (size_t)T, fb + row * CAMH, row * (size_t)T);
  g_ckEnvBandW = W; g_ckEnvBandT = T; g_ckEnvBandPending = 1;
}

/* the captured row for band row y (-T <= y < 0 or CAMH <= y < CAMH + T); NULL elsewhere */
static const uint8_t* ckEnvBandRow(int y) {
  const int T = g_ckEnvBandT;
  const size_t row = (size_t)g_ckEnvBandW * 3;
  if (!g_ckEnvBand || T < 1) return NULL;
  if (y >= -T && y < 0) return g_ckEnvBand + (size_t)(y + T) * row;
  if (y >= CAMH && y < CAMH + T) return g_ckEnvBand + (size_t)(T + y - CAMH) * row;
  return NULL;
}
