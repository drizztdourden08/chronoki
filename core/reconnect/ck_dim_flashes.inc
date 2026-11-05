/* The Dim Flashes limiter (included by present_reconnect.c; runs only while ck_dim_flashes() is 1, so off the frames are
   untouched). The level of a picture is its mean brightness on a coarse grid (every 8th pixel of every 8th line). When a
   picture is brighter than the one shown before it by more than CK_DIM_RISE (0..255 scale), it is scaled down so it
   rises by only that much; the next frame may rise by that much again, so a flash is flattened to a ramp while a fade
   (small steps per frame) is never touched. Returns the gain, 256 = unchanged. */
#define CK_DIM_STEP 8
#define CK_DIM_RISE 40

static int g_dimLast = 0, g_dimHave = 0;

static int ckDimLevel(const uint8_t* rgb24, int w, int h) {
  long sum = 0, n = 0;
  for (int y = 0; y < h; y += CK_DIM_STEP) {
    const uint8_t* row = rgb24 + (size_t)y * (size_t)w * 3;
    for (int x = 0; x < w; x += CK_DIM_STEP, n++) {
      const uint8_t* s = row + (size_t)x * 3;
      sum += (s[0] * 77 + s[1] * 151 + s[2] * 28) >> 8;
    }
  }
  return n > 0 ? (int)(sum / n) : 0;
}

static int ckDimGain(const uint8_t* rgb24, int w, int h) {
  const int level = ckDimLevel(rgb24, w, h);
  int gain = 256;
  if (g_dimHave && level > g_dimLast + CK_DIM_RISE && level > 0) gain = (g_dimLast + CK_DIM_RISE) * 256 / level;
  g_dimLast = level * gain / 256;
  g_dimHave = 1;
  return gain;
}

static void ckDimApply(uint8_t* rgba, size_t pixels, int gain) {
  for (size_t i = 0; i < pixels; i++, rgba += 4) {
    rgba[0] = (uint8_t)(rgba[0] * gain >> 8);
    rgba[1] = (uint8_t)(rgba[1] * gain >> 8);
    rgba[2] = (uint8_t)(rgba[2] * gain >> 8);
  }
}
