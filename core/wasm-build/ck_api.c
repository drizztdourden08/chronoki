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
/* Save states (reconnect/ck_state.c). CkStateSave and CkStateLoad only raise a request; the engine services it at the next
   safe pass of its loop (held, and given up after a bounded number of frames). CkStateStatus: 0 idle, 1 pending, 2 ok,
   3 failed; CkStateReason says why. A saved container is read at CkStateBuffer for CkStateSize bytes, valid until the next
   save. A container to load is written at CkStateInput(len) first, then CkStateLoad(ptr, len) copies it. */
EMSCRIPTEN_KEEPALIVE int CkStateSave(void) { return ck_state_request_save(); }
EMSCRIPTEN_KEEPALIVE int CkStateLoad(const uint8_t* bytes, int len) { return ck_state_request_load(bytes, len); }
EMSCRIPTEN_KEEPALIVE const void* CkStateBuffer(void) { return ck_state_buffer((long*)0); }
EMSCRIPTEN_KEEPALIVE int CkStateSize(void) { long n = 0; ck_state_buffer(&n); return (int)n; }
EMSCRIPTEN_KEEPALIVE void* CkStateInput(int len) { return ck_state_input(len); }
EMSCRIPTEN_KEEPALIVE const char* CkStateStamp(void) { return ck_state_stamp(); }
EMSCRIPTEN_KEEPALIVE int CkStateStatus(void) { return ck_state_status(); }
EMSCRIPTEN_KEEPALIVE int CkStateReason(void) { return ck_state_reason(); }
EMSCRIPTEN_KEEPALIVE int CkStateAvailable(void) { return ck_state_available(); }
EMSCRIPTEN_KEEPALIVE const void* CkFramePtr(void) { return ck_frame_rgba(); }
EMSCRIPTEN_KEEPALIVE int CkFrameWidth(void) { int w, h; ck_frame_info(&w, &h); return w; }
EMSCRIPTEN_KEEPALIVE int CkFrameHeight(void) { int w, h; ck_frame_info(&w, &h); return h; }
EMSCRIPTEN_KEEPALIVE int CkFrameCount(void) { return (int)ck_frame_count(); }
/* Stereo frames queued since the last call (consumes them); CkSamplesPtr is the S16 interleaved buffer. */
EMSCRIPTEN_KEEPALIVE int CkSampleCount(void) { return ck_audio_take((const int16_t**)0); }
EMSCRIPTEN_KEEPALIVE const void* CkSamplesPtr(void) { return ck_audio_ptr(); }
