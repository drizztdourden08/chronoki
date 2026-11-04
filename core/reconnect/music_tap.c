/* The music tap. The game stages a 4-byte command at $1E00-$1E03 and calls CtAudioService (the port of JSL $C7:0004);
   build.mjs links with -Wl,--wrap=CtAudioService so this wrapper sees every call and then runs the real one unchanged.
   Output only: nothing is written back into the game. CkMusicState (ck_api.c) hands the ring to the host after a frame. */
#include <string.h>
#include "audio.h"
#include "ck_music.h"
#include "ck_reconnect.h"

int g_ckGain[2] = { 256, 256 };

/* the ARAM addresses, pinned by wasm-build/patches/mixer-gains.mjs against sound/driver.c's enum */
enum { ARAM_SONG = 0x80, ARAM_SFX_VOICES = 0x86, ARAM_FADE_HI = 0xF161 };

static CkMusicStateT g_state;
static CkMusicCmd g_ring[CK_MUSIC_RING];
static uint32_t g_head, g_count, g_seq, g_dropped;
static const CtAudio* g_audio;

int __real_CtAudioService(CtAudio* a, uint8_t* mem7E);

int __wrap_CtAudioService(CtAudio* a, uint8_t* mem7E) {
  if (a) g_audio = a;
  if (a && mem7E && mem7E[0x1E00]) {
    CkMusicCmd c = { mem7E[0x1E00], mem7E[0x1E01], mem7E[0x1E02], mem7E[0x1E03], (uint32_t)ck_frame_count() };
    if (g_count == CK_MUSIC_RING) { g_head = (g_head + 1) % CK_MUSIC_RING; g_count--; g_dropped++; }
    g_ring[(g_head + g_count) % CK_MUSIC_RING] = c;
    g_count++;
    g_seq++;
  }
  return __real_CtAudioService(a, mem7E);
}

const CkMusicStateT* ck_music_state(void) {
  const uint8_t* aram = g_audio ? CtAudioAram(g_audio) : 0;
  memset(&g_state, 0, sizeof g_state);
  g_state.seq = g_seq;
  g_state.dropped = g_dropped;
  g_state.count = g_count;
  for (uint32_t i = 0; i < g_count; i++) g_state.ring[i] = g_ring[(g_head + i) % CK_MUSIC_RING];
  g_state.song = 0xFF;
  if (aram) {
    g_state.song = aram[ARAM_SONG];
    g_state.sfxVoices = aram[ARAM_SFX_VOICES];
    g_state.fade = aram[ARAM_FADE_HI];
    g_state.valid = 1;
  }
  g_head = g_count = g_dropped = 0;
  return &g_state;
}
