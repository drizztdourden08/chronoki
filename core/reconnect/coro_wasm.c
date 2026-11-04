/* sound/coro.h on WebAssembly, in place of Belthasar's sound/coro.c (sources.mjs drops it). That file switches with
   ucontext, Windows fibers or a register switch of its own; emscripten has none of them, and its fibers
   (emscripten_fiber_swap) need Asyncify, which cannot sit beside the JSPI the engine's loop runs on (ck_loop.c).

   So a coroutine is a JSPI stack of its own. ck_coro_entry is a second JSPI export (build.mjs), entered from JS the
   first time the coroutine is resumed. A resume or a yield is a suspending import: it wakes the other side's promise
   and sleeps on its own, so exactly one side runs at a time (coro.h's strict hand-over). One coroutine exists per sound
   machine (sound/machine.c: the driver program); it never presents, so no frame park happens inside it.

   The C stack pointer (emscripten's __stack_pointer, into linear memory) is one global shared by every JSPI stack, so
   each side puts its own value back when it wakes: the coroutine runs on a 1 MiB block of its own (as coro.c's), the
   resumer where it was. The stack limits are not swapped: below -sSTACK_OVERFLOW_CHECK=2 (not used) they only place the
   main stack's cookie. */
#include <emscripten.h>
#include <emscripten/stack.h>
#include <stdint.h>
#include <stdlib.h>
#include "sound/coro.h"

#define CK_CORO_STACK (1 << 20)

struct SndCoro {
  void (*fn)(void*);
  void* arg;
  void* stack;
  uintptr_t top;        /* the coroutine's stack top (16-aligned): where it starts */
  uintptr_t sp;         /* its stack pointer while it is suspended */
  uintptr_t callerSp;   /* the resumer's while the coroutine runs */
  int done;
};

void _emscripten_stack_restore(uintptr_t sp);   /* compiler-rt stack_ops.S: __stack_pointer = sp */

/* Module.ckCoros: per coroutine, toCoro (wakes the suspended coroutine), toCaller / fail (wake or fail its resumer). */
EM_ASYNC_JS(void, ck_coro_js_resume, (SndCoro* c), {
  const all = Module.ckCoros || (Module.ckCoros = new Map());
  let s = all.get(c);
  if (!s) { s = { started: false, toCoro: null, toCaller: null, fail: null }; all.set(c, s); }
  const back = new Promise((resolve, reject) => { s.toCaller = resolve; s.fail = reject; });
  if (!s.started) {
    s.started = true;
    Module._ck_coro_entry(c).catch((e) => { const f = s.fail; s.toCaller = null; s.fail = null; if (f) f(e); });
  } else {
    const w = s.toCoro; s.toCoro = null; w();
  }
  await back;
});

EM_ASYNC_JS(void, ck_coro_js_yield, (SndCoro* c), {
  const s = Module.ckCoros.get(c);
  const wake = new Promise((resolve) => { s.toCoro = resolve; });
  const t = s.toCaller; s.toCaller = null; s.fail = null;
  t();
  await wake;
});

EM_JS(void, ck_coro_js_finish, (SndCoro* c), {
  const s = Module.ckCoros.get(c);
  const t = s && s.toCaller;
  if (t) { s.toCaller = null; s.fail = null; t(); }
});

EM_JS(void, ck_coro_js_forget, (SndCoro* c), {
  if (Module.ckCoros) Module.ckCoros.delete(c);   /* a suspended coroutine's JSPI stack goes with its resolver */
});

/* noinline: its frame is on the coroutine's stack, set by ck_coro_entry before the call */
static __attribute__((noinline)) void coroBody(SndCoro* c) {
  c->fn(c->arg);
  c->done = 1;
  ck_coro_js_finish(c);
}

EMSCRIPTEN_KEEPALIVE void ck_coro_entry(SndCoro* c) {
  _emscripten_stack_restore(c->top);
  coroBody(c);
}

SndCoro* SndCoroNew(void (*fn)(void*), void* arg) {
  SndCoro* c = (SndCoro*)calloc(1, sizeof *c);
  if (!c) return NULL;
  c->fn = fn; c->arg = arg;
  c->stack = malloc(CK_CORO_STACK);
  if (!c->stack) { free(c); return NULL; }
  c->top = ((uintptr_t)c->stack + CK_CORO_STACK) & ~(uintptr_t)15;
  return c;
}

void SndCoroResume(SndCoro* c) {
  if (!c || c->done) return;
  c->callerSp = emscripten_stack_get_current();
  ck_coro_js_resume(c);
  _emscripten_stack_restore(c->callerSp);
}

void SndCoroYield(SndCoro* c) {
  c->sp = emscripten_stack_get_current();
  ck_coro_js_yield(c);
  _emscripten_stack_restore(c->sp);
}

int SndCoroDone(const SndCoro* c) { return !c || c->done; }

void SndCoroFree(SndCoro* c) {   /* a coroutine not done is abandoned, as coro.c's */
  if (!c) return;
  ck_coro_js_forget(c);
  free(c->stack);
  free(c);
}
