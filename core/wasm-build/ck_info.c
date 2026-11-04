/* The game-info widget's seam (plans/game-info-widget-plan.html, "How the app reads it"). Read only; no game text lives here:
   every name is produced by the engine's own decoders from the player's datapack.
   CtWramCreate is wrapped at link time (-Wl,--wrap=CtWramCreate in build.mjs, like CtAudioService for music_tap.c): field.c's
   fieldWram() calls it once per process, so the pointer seen here is the live flat WRAM image ($7E at +0, $7F at +0x10000). */
#include <stdint.h>
#include <string.h>
#include <emscripten.h>
#include "ct_vm.h"
#include "menu.h"

CtWram* __real_CtWramCreate(void);

static CtWram* g_seenWram = 0;
static char g_nameBuf[96];

CtWram* __wrap_CtWramCreate(void) {
  CtWram* w = __real_CtWramCreate();
  g_seenWram = w;
  return w;
}

/* Copy into a static buffer so the answer stays valid until the next call whatever the engine's string lifetime is. */
static int keep(const char* s) {
  if (!s) s = "";
  strncpy(g_nameBuf, s, sizeof g_nameBuf - 1);
  g_nameBuf[sizeof g_nameBuf - 1] = 0;
  return (int)(intptr_t)g_nameBuf;
}

/* Wasm32 address of the WRAM image, 0 until the field host has created it. */
EMSCRIPTEN_KEEPALIVE int CkWramPtr(void) { return (int)(intptr_t)g_seenWram; }
/* char* (ASCII, ROM era name) for a location id: CtMenuLoaderEra (menu.c). */
EMSCRIPTEN_KEEPALIVE int CkEraName(int locId) { return keep(CtMenuLoaderEra(locId)); }
/* char* (ASCII, ROM chapter title) for the storyline byte ($7F0000): CtMenuLoaderChapter(story, 1) (menu.c). */
EMSCRIPTEN_KEEPALIVE int CkChapterName(int story) { return keep(CtMenuLoaderChapter(story, 1)); }
/* char* (ASCII, the player-entered name) for char id 0-7: CtGetName (ct_vm.c). */
EMSCRIPTEN_KEEPALIVE int CkCharName(int id) { return keep(CtGetName(id)); }
