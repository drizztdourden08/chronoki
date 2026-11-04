/* No window system, so no events: the host's buttons come through CkSetInput -> CtTouchPadButtons
   (touchpad_reconnect.c), which field.c reads as a level every frame.

   Save states ride on the engine's debug keys (field.c: F5 writes /ct_debug.state and /ct_debug.state.apu, F9 reads them,
   both only in a field scene). ck_state_request holds the key down for a few frames, which gives the engine one edge. */
#include "SDL.h"
#include "ck_reconnect.h"
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

#define CK_STATE_FILE "/ct_debug.state"
#define CK_STATE_HOLD_POLLS 3
#define CK_STATE_RETRY_FRAMES 60

static Uint8 g_keys[SDL_NUM_SCANCODES];   /* all zero: nobody is holding a key */

static int g_stateKey = 0;      /* the scancode being held, 0 when idle */
static int g_stateIsSave = 0;
static int g_statePolls = 0;
static int g_stateStatus = 0;   /* 0 idle, 1 pending, 2 ok, 3 failed */
static long g_stateFailedAt = -CK_STATE_RETRY_FRAMES;

static int stateFileExists(void) { struct stat st; return stat(CK_STATE_FILE, &st) == 0; }

static void stateFinish(void) {
  g_keys[g_stateKey] = 0;
  g_stateKey = 0;
  g_stateStatus = stateFileExists() ? 2 : 3;
  if (g_stateStatus == 3) g_stateFailedAt = ck_frame_count();
}

int ck_state_request(int save) {
  if (g_stateStatus == 1) return 0;
  if (save) unlink(CK_STATE_FILE);
  else if (!stateFileExists()) { g_stateStatus = 3; g_stateFailedAt = ck_frame_count(); return 0; }
  g_stateIsSave = save;
  g_stateKey = save ? SDL_SCANCODE_F5 : SDL_SCANCODE_F9;
  g_statePolls = CK_STATE_HOLD_POLLS;
  g_keys[g_stateKey] = 1;
  g_stateStatus = 1;
  return 1;
}
int ck_state_status(void) { return g_stateStatus; }
int ck_state_available(void) {
  if (g_stateStatus == 1) return 0;
  return ck_frame_count() > 0 && ck_frame_count() - g_stateFailedAt >= CK_STATE_RETRY_FRAMES;
}

int SDL_PollEvent(SDL_Event* e) {
  (void)e;
  if (g_stateKey && --g_statePolls <= 0) stateFinish();
  return 0;
}
const Uint8* SDL_GetKeyboardState(int* numkeys) { if (numkeys) *numkeys = SDL_NUM_SCANCODES; return g_keys; }
int SDL_ShowCursor(int toggle) { (void)toggle; return SDL_DISABLE; }
int SDL_ShowSimpleMessageBox(Uint32 flags, const char* title, const char* message, SDL_Window* w) {
  (void)flags; (void)w;
  fprintf(stderr, "%s: %s\n", title ? title : "ChronoKi", message ? message : "");
  return 0;
}
