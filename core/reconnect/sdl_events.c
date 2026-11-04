/* No window system, so no events: the host's buttons come through CkSetInput -> CtTouchPadButtons
   (touchpad_reconnect.c), which field.c reads as a level every frame. Save states have no key here: they are a request
   flag the engine services itself (ck_state.c). */
#include "SDL.h"
#include "ck_reconnect.h"
#include <stdio.h>

static Uint8 g_keys[SDL_NUM_SCANCODES];   /* all zero: nobody is holding a key */

int SDL_PollEvent(SDL_Event* e) { (void)e; return 0; }
const Uint8* SDL_GetKeyboardState(int* numkeys) { if (numkeys) *numkeys = SDL_NUM_SCANCODES; return g_keys; }
int SDL_ShowCursor(int toggle) { (void)toggle; return SDL_DISABLE; }
int SDL_ShowSimpleMessageBox(Uint32 flags, const char* title, const char* message, SDL_Window* w) {
  (void)flags; (void)w;
  fprintf(stderr, "%s: %s\n", title ? title : "ChronoKi", message ? message : "");
  return 0;
}
