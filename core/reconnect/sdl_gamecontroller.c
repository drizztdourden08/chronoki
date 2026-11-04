/* No game controllers: the shell maps its gamepads to CkSetInput itself. */
#include "SDL.h"

int SDL_NumJoysticks(void) { return 0; }
int SDL_IsGameController(int index) { (void)index; return 0; }
SDL_GameController* SDL_GameControllerOpen(int index) { (void)index; return NULL; }
void SDL_GameControllerClose(SDL_GameController* c) { (void)c; }
const char* SDL_GameControllerName(SDL_GameController* c) { (void)c; return NULL; }
SDL_Joystick* SDL_GameControllerGetJoystick(SDL_GameController* c) { (void)c; return NULL; }
SDL_JoystickID SDL_JoystickInstanceID(SDL_Joystick* j) { (void)j; return -1; }
Sint16 SDL_GameControllerGetAxis(SDL_GameController* c, SDL_GameControllerAxis a) { (void)c; (void)a; return 0; }
Uint8 SDL_GameControllerGetButton(SDL_GameController* c, SDL_GameControllerButton b) { (void)c; (void)b; return 0; }
