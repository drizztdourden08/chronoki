/* Init, errors, environment and the window's queries. The "window" is the host's canvas: always one size, never
   fullscreen from the engine's point of view (the shell owns that). */
#include "SDL.h"
#include <string.h>
#include <stdio.h>

static int g_winW = 256, g_winH = 224;

int SDL_Init(Uint32 flags) { (void)flags; return 0; }
int SDL_InitSubSystem(Uint32 flags) { (void)flags; return 0; }
void SDL_Quit(void) {}
void SDL_SetMainReady(void) {}
int SDL_setenv(const char* name, const char* value, int overwrite) {
  if (!name || !*name) return -1;
  if (!overwrite && getenv(name)) return 0;
  extern int setenv(const char*, const char*, int);
  return setenv(name, value ? value : "", 1);
}
const char* SDL_GetError(void) { return ""; }
char* SDL_GetBasePath(void) { char* p = (char*)malloc(2); if (p) strcpy(p, "/"); return p; }
void SDL_free(void* p) { free(p); }
const char* SDL_GetCurrentVideoDriver(void) { return "chronoki"; }   /* not "dummy": the run is interactive */
Uint32 SDL_GetWindowFlags(SDL_Window* w) { (void)w; return 0; }
void SDL_GetWindowSize(SDL_Window* w, int* pw, int* ph) { (void)w; if (pw) *pw = g_winW; if (ph) *ph = g_winH; }
void SDL_SetWindowSize(SDL_Window* w, int pw, int ph) { (void)w; if (pw > 0) g_winW = pw; if (ph > 0) g_winH = ph; }
int SDL_SetWindowFullscreen(SDL_Window* w, Uint32 flags) { (void)w; (void)flags; return 0; }
int SDL_GetWindowDisplayIndex(SDL_Window* w) { (void)w; return 0; }
int SDL_GetCurrentDisplayMode(int index, SDL_DisplayMode* m) {
  (void)index;
  if (m) { memset(m, 0, sizeof *m); m->w = g_winW; m->h = g_winH; m->refresh_rate = 60; }
  return 0;
}
