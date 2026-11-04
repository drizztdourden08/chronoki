/* Unknown 1: the engine's main() is a blocking loop (field.c: events -> sound -> logic -> present -> pace). JSPI lets
   it suspend at each present and resume later, so the loop is unchanged.

   Port-kit calls the core's runFrame synchronously (ccall, no await), so CkRunFrame cannot itself be the suspended
   call. Instead it grants the engine a credit and resolves the promise the engine sleeps on; the engine resumes when
   the host's JS stack unwinds (a microtask), runs one frame, and parks at the next present. The host therefore reads
   the frame the previous call asked for: a constant one-frame latency. Extra credits (catch-up steps) just make the
   engine run frames back to back. */
#include <emscripten.h>
#include <stdlib.h>
#include "ck_reconnect.h"

static int g_credits = 0;
static int g_stop = 0;

EM_ASYNC_JS(void, ck_js_sleep, (void), {
  await new Promise((resolve) => { Module.ckWake = resolve; });
});
EM_JS(void, ck_js_wake, (void), {
  const w = Module.ckWake;
  if (w) { Module.ckWake = null; w(); }
});

/* build.mjs --trace: a stderr line for the first presents, then one a second (main parking and resuming, credits) */
#ifdef CK_TRACE
#include <stdio.h>
static long g_parks = 0;
#define CK_TRACE_DUE(n) ((n) <= 5 || (n) % 60 == 0)
#endif

void ck_yield_to_host(void) {
#ifdef CK_TRACE
  long n = ++g_parks;
  if (CK_TRACE_DUE(n)) fprintf(stderr, "[ck] present %ld: credits %d%s\n", n, g_credits, g_credits <= 0 ? ", main parks" : "");
#endif
  while (g_credits <= 0 && !g_stop) ck_js_sleep();
#ifdef CK_TRACE
  if (CK_TRACE_DUE(n)) fprintf(stderr, "[ck] present %ld: main resumed (credits %d, stop %d)\n", n, g_credits, g_stop);
#endif
  if (g_stop) exit(0);
  g_credits--;
}

void ck_credit(int n) {
#ifdef CK_TRACE
  static long calls = 0;
  if (CK_TRACE_DUE(++calls)) fprintf(stderr, "[ck] CkRunFrame %ld: credits %d%s\n", calls, g_credits, g_credits + n > 8 ? " (capped)" : "");
#endif
  if (g_credits + n > 8) return;   /* never queue a backlog the host cannot show */
  g_credits += n;
  ck_js_wake();
}

void ck_stop(void) { g_stop = 1; ck_js_wake(); }
