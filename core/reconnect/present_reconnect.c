/* The presenter (src/present.h): the engine uploads an RGB24 picture of CtPresentSetPicSize's size and swaps once per
   frame. Here the upload is converted to RGBA8888 in a buffer the host reads (CkFramePtr/CkFrameWidth/CkFrameHeight,
   ck_api.c), and the swap is the point where the engine parks until the host asks for its next frame.
   The host's canvas has one size for the whole session (port-kit reads the buffer at its port's fixed video size), but
   the picture's size changes with the options and even from frame to frame (at 1x with interpolation, the frames between
   are drawn at 4x). So the host writes its size to /ck_frame_size.txt ("width height") and every picture is fitted to it
   (nearest), the buffer always holding exactly that size. Without the file the buffer follows the picture. */
#include "SDL.h"
#include "present.h"
#include "ck_reconnect.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct CtPresenter { int picW, picH; };
static struct CtPresenter g_pr = { 256, 224 };
static uint8_t* g_rgba = NULL;
static size_t g_cap = 0;
static long g_swaps = 0;
static int g_hostW = 0, g_hostH = 0, g_hostRead = 0;

#define CK_FRAME_SIZE_FILE "/ck_frame_size.txt"
#define CK_FRAME_MAX_SIDE 4096

static void readHostSize(void) {
  if (g_hostRead) return;
  g_hostRead = 1;
  FILE* f = fopen(CK_FRAME_SIZE_FILE, "rb");
  if (!f) return;
  int w = 0, h = 0;
  if (fscanf(f, "%d %d", &w, &h) == 2 && w > 0 && h > 0 && w <= CK_FRAME_MAX_SIDE && h <= CK_FRAME_MAX_SIDE) {
    g_hostW = w; g_hostH = h;
  }
  fclose(f);
}
static int outW(void) { readHostSize(); return g_hostW ? g_hostW : g_pr.picW; }
static int outH(void) { readHostSize(); return g_hostH ? g_hostH : g_pr.picH; }

static void ensure(int w, int h) {
  size_t need = (size_t)w * (size_t)h * 4;
  if (need > g_cap) { free(g_rgba); g_rgba = (uint8_t*)calloc(need, 1); g_cap = g_rgba ? need : 0; }
}

CtPresenter* CtPresentCreate(const CtPresentConfig* cfg) {
  if (cfg && cfg->picW > 0 && cfg->picH > 0) { g_pr.picW = cfg->picW; g_pr.picH = cfg->picH; }
  ensure(outW(), outH());
  return &g_pr;
}
void CtPresentDestroy(CtPresenter* p) { (void)p; }
SDL_Window* CtPresentWindow(CtPresenter* p) { return (SDL_Window*)p; }
const char* CtPresentName(const CtPresenter* p) { (void)p; return "ChronoKi canvas"; }

void CtPresentSetPicSize(CtPresenter* p, int w, int h) {
  if (w <= 0 || h <= 0) return;
  p->picW = w; p->picH = h;
  ensure(outW(), outH());
}
void CtPresentUpload(CtPresenter* p, const uint8_t* rgb24) {
  const int ow = outW(), oh = outH();
  ensure(ow, oh);
  if (!g_rgba || !rgb24) return;
  uint8_t* d = g_rgba;
  if (ow == p->picW && oh == p->picH) {
    size_t n = (size_t)ow * (size_t)oh;
    for (size_t i = 0; i < n; i++, rgb24 += 3, d += 4) { d[0] = rgb24[0]; d[1] = rgb24[1]; d[2] = rgb24[2]; d[3] = 255; }
    return;
  }
  for (int y = 0; y < oh; y++) {
    const uint8_t* row = rgb24 + (size_t)((long long)y * p->picH / oh) * (size_t)p->picW * 3;
    for (int x = 0; x < ow; x++, d += 4) {
      const uint8_t* s = row + (size_t)((long long)x * p->picW / ow) * 3;
      d[0] = s[0]; d[1] = s[1]; d[2] = s[2]; d[3] = 255;
    }
  }
}
void CtPresentDraw(CtPresenter* p, const SDL_Rect* dst, int linear) { (void)p; (void)dst; (void)linear; }
void CtPresentSwap(CtPresenter* p) { (void)p; g_swaps++; ck_yield_to_host(); }
void CtPresentSetVsync(CtPresenter* p, int on) { (void)p; (void)on; }
void CtPresentOutputSize(CtPresenter* p, int* w, int* h) { if (w) *w = p->picW; if (h) *h = p->picH; }
int CtPresentSaveBMP(CtPresenter* p, const char* path) { (void)p; (void)path; return 0; }
SDL_Renderer* CtPresentSdlRenderer(CtPresenter* p) { (void)p; return NULL; }
void* CtPresentGlContext(CtPresenter* p) { (void)p; return NULL; }
struct CtVk* CtPresentVk(CtPresenter* p) { (void)p; return NULL; }

/* the host's side (ck_api.c) */
const uint8_t* ck_frame_rgba(void) { return g_rgba; }
long ck_frame_count(void) { return g_swaps; }
void ck_frame_info(int* w, int* h) { if (w) *w = outW(); if (h) *h = outH(); }
