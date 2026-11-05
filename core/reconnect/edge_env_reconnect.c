/* The Edge Effect's environment picture (the host's edgeEffect gate): the shown field frame with its actors taken out,
   for the host's border glow to mirror instead of the composited frame. RotP does the same with a second PPU render
   (WasmRenderCleanFrame: NoBG3 | NoSprites); Belthasar has no PPU, so the patched field.c builds it at the present from
   the frame's own motion record (ck_edge_env.inc, wasm-build/patches/edge-env.mjs) into the buffer kept here.
   The host turns it on (CkSetEdgeEnv) only while its Edge Effect draws. Off (the default) nothing is built, nothing is
   allocated: the field's compose and present run as before. */
#include "ck_reconnect.h"
#include <stdlib.h>

static uint8_t* g_env = NULL;
static size_t g_envCap = 0;
static int g_envOn = 0, g_envValid = 0, g_envW = 0, g_envH = 0;

#define CK_ENV_MAX_SIDE 4096

int ck_edge_env_on(void) { return g_envOn; }

void ck_edge_env_set(int on) {
  g_envOn = on != 0;
  if (!g_envOn) g_envValid = 0;
}

uint8_t* ck_edge_env_begin(int w, int h) {
  g_envValid = 0;
  if (w < 1 || h < 1 || w > CK_ENV_MAX_SIDE || h > CK_ENV_MAX_SIDE) return NULL;
  const size_t need = (size_t)w * (size_t)h * 4;
  if (need > g_envCap) {
    free(g_env);
    g_env = (uint8_t*)malloc(need);
    g_envCap = g_env ? need : 0;
  }
  if (!g_env) return NULL;
  g_envW = w; g_envH = h;
  return g_env;
}

void ck_edge_env_publish(int valid) { g_envValid = valid && g_envOn && g_env != NULL; }

const uint8_t* ck_edge_env_ptr(void) { return g_envValid ? g_env : NULL; }

void ck_edge_env_size(int* w, int* h) {
  if (w) *w = g_envValid ? g_envW : 0;
  if (h) *h = g_envValid ? g_envH : 0;
}

int ck_edge_env_valid(void) { return g_envValid; }
