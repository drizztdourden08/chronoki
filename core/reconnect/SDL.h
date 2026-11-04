/* ChronoKi reconnect layer: the SDL subset Belthasar's game target calls (src/field.c), with no SDL library behind it.
   Everything here is declared and implemented in core/reconnect/*.c. The engine's other files that include "SDL.h"
   (present.h, settings.h, touchpad.h, overlay.h) only need the types. */
#ifndef CK_SDL_H
#define CK_SDL_H
#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>
#ifdef __cplusplus
extern "C" {
#endif

#ifndef SDL_MAIN_HANDLED
#define SDL_MAIN_HANDLED 1
#endif

typedef uint8_t Uint8; typedef uint16_t Uint16; typedef uint32_t Uint32; typedef uint64_t Uint64;
typedef int32_t Sint32; typedef int16_t Sint16;

typedef struct SDL_Window SDL_Window;
typedef struct SDL_Renderer SDL_Renderer;
typedef struct SDL_Rect { int x, y, w, h; } SDL_Rect;
typedef struct SDL_DisplayMode { Uint32 format; int w, h, refresh_rate; void* driverdata; } SDL_DisplayMode;

typedef Uint32 SDL_AudioDeviceID;
typedef Uint16 SDL_AudioFormat;
typedef struct SDL_AudioSpec {
  int freq; SDL_AudioFormat format; Uint8 channels; Uint8 silence; Uint16 samples; Uint16 padding; Uint32 size;
  void* callback; void* userdata;
} SDL_AudioSpec;
#define AUDIO_S16SYS 0x8010

typedef int SDL_Scancode;
typedef Sint32 SDL_Keycode;
typedef int SDL_GameControllerButton;
typedef int SDL_GameControllerAxis;
typedef struct SDL_GameController SDL_GameController;
typedef struct SDL_Joystick SDL_Joystick;
typedef Sint32 SDL_JoystickID;

#define SDL_QUIT 0x100
#define SDL_APP_WILLENTERBACKGROUND 0x103
#define SDL_APP_DIDENTERFOREGROUND 0x106
#define SDL_KEYDOWN 0x300
#define SDL_MOUSEMOTION 0x400
#define SDL_CONTROLLERBUTTONDOWN 0x650
#define SDL_CONTROLLERDEVICEADDED 0x653
#define SDL_CONTROLLERDEVICEREMOVED 0x654
#define SDL_FINGERDOWN 0x700
#define SDL_FINGERUP 0x701
#define SDL_FINGERMOTION 0x702
#define SDL_TOUCH_MOUSEID ((Uint32)-1)

typedef struct SDL_Keysym { SDL_Scancode scancode; SDL_Keycode sym; Uint16 mod; Uint32 unused; } SDL_Keysym;
typedef struct SDL_KeyboardEvent { Uint32 type, timestamp, windowID; Uint8 state, repeat, padding2, padding3; SDL_Keysym keysym; } SDL_KeyboardEvent;
typedef struct SDL_MouseMotionEvent { Uint32 type, timestamp, windowID, which, state; Sint32 x, y, xrel, yrel; } SDL_MouseMotionEvent;
typedef struct SDL_ControllerButtonEvent { Uint32 type, timestamp; SDL_JoystickID which; Uint8 button, state, padding1, padding2; } SDL_ControllerButtonEvent;
typedef struct SDL_ControllerDeviceEvent { Uint32 type, timestamp; Sint32 which; } SDL_ControllerDeviceEvent;
typedef struct SDL_TouchFingerEvent { Uint32 type, timestamp; int64_t touchId, fingerId; float x, y, dx, dy, pressure; Uint32 windowID; } SDL_TouchFingerEvent;
typedef union SDL_Event {
  Uint32 type;
  SDL_KeyboardEvent key;
  SDL_MouseMotionEvent motion;
  SDL_ControllerButtonEvent cbutton;
  SDL_ControllerDeviceEvent cdevice;
  SDL_TouchFingerEvent tfinger;
  Uint8 padding[56];
} SDL_Event;

#define SDL_INIT_AUDIO 0x10u
#define SDL_INIT_VIDEO 0x20u
#define SDL_INIT_GAMECONTROLLER 0x2000u
#define SDL_ENABLE 1
#define SDL_DISABLE 0
#define SDL_QUERY (-1)
#define SDL_WINDOW_FULLSCREEN 0x1
#define SDL_WINDOW_FULLSCREEN_DESKTOP (0x1 | 0x1000)
#define SDL_MESSAGEBOX_ERROR 0x10
#define SDL_SCANCODE_F5 62
#define SDL_SCANCODE_F9 66
#define SDL_NUM_SCANCODES 512
#define SDLK_ESCAPE 27
#define SDLK_F1 0x4000003A
#define SDLK_F8 0x40000041
#define SDLK_AC_BACK 0x4000010E
#define SDL_CONTROLLER_BUTTON_GUIDE 5
#define SDL_CONTROLLER_AXIS_LEFTX 0
#define SDL_CONTROLLER_AXIS_LEFTY 1

/* sdl_clock.c: a virtual clock (microsecond counter), advanced by the host per frame and by SDL_Delay */
Uint64 SDL_GetPerformanceCounter(void);
Uint64 SDL_GetPerformanceFrequency(void);
Uint32 SDL_GetTicks(void);
void   SDL_Delay(Uint32 ms);

/* sdl_events.c */
int          SDL_PollEvent(SDL_Event* e);
const Uint8* SDL_GetKeyboardState(int* numkeys);
int          SDL_ShowCursor(int toggle);
int          SDL_ShowSimpleMessageBox(Uint32 flags, const char* title, const char* message, SDL_Window* w);

/* sdl_window.c */
int         SDL_Init(Uint32 flags);
int         SDL_InitSubSystem(Uint32 flags);
void        SDL_Quit(void);
void        SDL_SetMainReady(void);
int         SDL_setenv(const char* name, const char* value, int overwrite);
const char* SDL_GetError(void);
char*       SDL_GetBasePath(void);
void        SDL_free(void* p);
const char* SDL_GetCurrentVideoDriver(void);
Uint32      SDL_GetWindowFlags(SDL_Window* w);
void        SDL_GetWindowSize(SDL_Window* w, int* pw, int* ph);
void        SDL_SetWindowSize(SDL_Window* w, int pw, int ph);
int         SDL_SetWindowFullscreen(SDL_Window* w, Uint32 flags);
int         SDL_GetWindowDisplayIndex(SDL_Window* w);
int         SDL_GetCurrentDisplayMode(int index, SDL_DisplayMode* m);

/* sdl_audio.c */
SDL_AudioDeviceID SDL_OpenAudioDevice(const char* dev, int iscapture, const SDL_AudioSpec* want, SDL_AudioSpec* have, int allowed);
void   SDL_CloseAudioDevice(SDL_AudioDeviceID d);
void   SDL_PauseAudioDevice(SDL_AudioDeviceID d, int pause_on);
int    SDL_QueueAudio(SDL_AudioDeviceID d, const void* data, Uint32 len);
Uint32 SDL_GetQueuedAudioSize(SDL_AudioDeviceID d);
void   SDL_ClearQueuedAudio(SDL_AudioDeviceID d);

/* sdl_gamecontroller.c: no controllers here; the host feeds buttons through CkSetInput */
int                 SDL_NumJoysticks(void);
int                 SDL_IsGameController(int index);
SDL_GameController* SDL_GameControllerOpen(int index);
void                SDL_GameControllerClose(SDL_GameController* c);
const char*         SDL_GameControllerName(SDL_GameController* c);
SDL_Joystick*       SDL_GameControllerGetJoystick(SDL_GameController* c);
SDL_JoystickID      SDL_JoystickInstanceID(SDL_Joystick* j);
Sint16              SDL_GameControllerGetAxis(SDL_GameController* c, SDL_GameControllerAxis a);
Uint8               SDL_GameControllerGetButton(SDL_GameController* c, SDL_GameControllerButton b);

#ifdef __cplusplus
}
#endif
#endif
