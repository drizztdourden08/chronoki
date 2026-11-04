/* ChronoKi tall rendering: the gate and the present (docs/plans/tall-rendering-engine-patch.md). Included by the patched
   field.c right after hostUpload (wasm-build/patches/tall-field.mjs).
   hostTallT: the band rows a side the option asks for. 0 = off: headless (the suite, the oracle), the widescreen (a tall
   picture is 256 wide; a wide one keeps 224 lines), or tall_lines unset / 224.
   ckTallUpload: with tall on, every picture goes up at the same size, 256 x (224 + 2t): the field's tall assembly as it
   is, any other frame (a menu, a battle, the overworld, a sequence: 224 lines) centred between black bands, as the
   widescreen pillarboxes a 256 frame. One picture a frame at 1x (T1: no internal scale, no frames between). 0 = off,
   the original upload runs. g_ckShowH stays set while g_wide holds the tall assembly: only the widescreen writes g_wide
   otherwise, and with it on hostTallT is 0. */
static int hostTallT(void) {
  if (!g_hostInteractive || hostWideW() != CAMW) return 0;
  const int lines = ck_tall_lines();
  return lines > CAMH && lines <= CK_FIELD_HMAX ? (lines - CAMH) / 2 : 0;
}
static uint8_t g_ckLetter[FIELD_WMAX * CK_FIELD_HMAX * 3];
static int ckTallUpload(CtPresenter* pr, const uint8_t* fb, int w) {
  const int t = hostTallT();
  if (!t) { g_ckShowH = CAMH; return 0; }
  const int H = CAMH + 2 * t;
  if (fb == g_wide && g_ckShowH == H) { hostUpload(pr, fb, w, H); return 1; }   /* (again too: the pause redraw's g_lastShown) */
  if (w < 1 || w > FIELD_WMAX) return 0;
  memset(g_ckLetter, 0, (size_t)w * H * 3);
  memcpy(g_ckLetter + (size_t)t * w * 3, fb, (size_t)w * CAMH * 3);
  hostUpload(pr, g_ckLetter, w, H);
  return 1;
}
