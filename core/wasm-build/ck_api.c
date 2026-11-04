/* The exports port-kit's CHRONOKI_CORE definition calls (plus the frame size, which varies with the widescreen and
   render-scale options). All plain synchronous functions: see ck_loop.c for how a frame is paced. */
#include <emscripten.h>
#include "ck_reconnect.h"

static int g_paused = 0;

EMSCRIPTEN_KEEPALIVE void CkStop(void) { ck_stop(); }
EMSCRIPTEN_KEEPALIVE void CkSetPaused(int paused) { g_paused = paused != 0; }
EMSCRIPTEN_KEEPALIVE void CkRunFrame(void) {
  if (g_paused) return;
  ck_clock_advance_ms(1000.0 / 60.0);
  ck_credit(1);
}
EMSCRIPTEN_KEEPALIVE void CkSetInput(unsigned mask) { ck_set_input_snes(mask); }
/* The engine writes /saves/ct_sram.srm itself at an in-game save; the shell persists that file. */
EMSCRIPTEN_KEEPALIVE int CkSaveSram(void) { return 1; }
/* No whole-core snapshot in the engine yet (docs/p3-findings.md, unknown 4). */
EMSCRIPTEN_KEEPALIVE int CkSaveState(void) { return 0; }
EMSCRIPTEN_KEEPALIVE int CkLoadState(void) { return 0; }
EMSCRIPTEN_KEEPALIVE const void* CkFramePtr(void) { return ck_frame_rgba(); }
EMSCRIPTEN_KEEPALIVE int CkFrameWidth(void) { int w, h; ck_frame_info(&w, &h); return w; }
EMSCRIPTEN_KEEPALIVE int CkFrameHeight(void) { int w, h; ck_frame_info(&w, &h); return h; }
EMSCRIPTEN_KEEPALIVE int CkFrameCount(void) { return (int)ck_frame_count(); }
/* Stereo frames queued since the last call (consumes them); CkSamplesPtr is the S16 interleaved buffer. */
EMSCRIPTEN_KEEPALIVE int CkSampleCount(void) { return ck_audio_take((const int16_t**)0); }
EMSCRIPTEN_KEEPALIVE const void* CkSamplesPtr(void) { return ck_audio_ptr(); }
