/* The "audio device" is a linear buffer the host drains once per CkRunFrame (CkSampleCount consumes it). The engine
   asks for 48 kHz S16 stereo and queues 800 stereo frames per engine frame. The queued size always reads 0, so the
   engine's level gate (field.c ~11606) never drops a block. */
#include "SDL.h"
#include "ck_reconnect.h"
#include <string.h>

#define CK_AUDIO_CAP (48000 * 2 * 2)   /* 2 s of stereo S16 samples, in int16 units; ring bigger than any catch-up */
static int16_t g_pcm[CK_AUDIO_CAP];
static int g_n = 0;                    /* int16 units queued since the last take */
static int g_open = 0;

SDL_AudioDeviceID SDL_OpenAudioDevice(const char* dev, int iscapture, const SDL_AudioSpec* want, SDL_AudioSpec* have, int allowed) {
  (void)dev; (void)iscapture; (void)allowed;
  if (have && want) *have = *want;
  g_open = 1;
  return 1;
}
void SDL_CloseAudioDevice(SDL_AudioDeviceID d) { (void)d; g_open = 0; }
void SDL_PauseAudioDevice(SDL_AudioDeviceID d, int pause_on) { (void)d; (void)pause_on; }
int SDL_QueueAudio(SDL_AudioDeviceID d, const void* data, Uint32 len) {
  (void)d;
  int n = (int)(len / 2);
  if (!g_open || n <= 0) return 0;
  if (g_n + n > CK_AUDIO_CAP) g_n = 0;       /* the host stopped draining: drop the backlog, never overflow */
  memcpy(g_pcm + g_n, data, (size_t)n * 2);
  g_n += n;
  return 0;
}
Uint32 SDL_GetQueuedAudioSize(SDL_AudioDeviceID d) { (void)d; return 0; }
void SDL_ClearQueuedAudio(SDL_AudioDeviceID d) { (void)d; g_n = 0; }

const int16_t* ck_audio_ptr(void) { return g_pcm; }
int ck_audio_take(const int16_t** pcm) {   /* stereo frames queued since the last take; resets */
  int frames = g_n / 2;
  if (pcm) *pcm = g_pcm;
  g_n = 0;
  return frames;
}
