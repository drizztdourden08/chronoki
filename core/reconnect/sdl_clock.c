/* The engine paces itself against SDL_GetPerformanceCounter and sleeps with SDL_Delay (field.c hostPaceDo). Here time
   is virtual: the host's frame (ck_loop.c, one CkRunFrame) moves the clock to the next 1/60 s tick, and SDL_Delay moves
   it by what it was asked to sleep, so the pacing loop always ends at once and never decides a present is late. */
#include "SDL.h"
#include "ck_reconnect.h"

static double g_nowMs = 0.0;     /* what the engine sees */
static double g_tickMs = 0.0;    /* the host's frame clock: n * 1000/60 */

void ck_clock_advance_ms(double ms) {   /* one host frame */
  g_tickMs += ms;
  if (g_nowMs < g_tickMs) g_nowMs = g_tickMs;   /* the engine's own sleeps are absorbed, never accumulated */
}

Uint64 SDL_GetPerformanceCounter(void) { return (Uint64)(g_nowMs * 1000.0); }
Uint64 SDL_GetPerformanceFrequency(void) { return 1000000ull; }
Uint32 SDL_GetTicks(void) { return (Uint32)g_nowMs; }
void SDL_Delay(Uint32 ms) { g_nowMs += ms ? (double)ms : 0.5; }
