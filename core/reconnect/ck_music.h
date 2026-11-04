/* ChronoKi music tap: what reconnect/music_tap.c shares with wasm-build/ck_api.c and the patched mixer. Output only: nothing
   here goes back into the game, and none of it is in a save state. */
#ifndef CK_MUSIC_H
#define CK_MUSIC_H
#include <stdint.h>
#ifdef __cplusplus
extern "C" {
#endif

#define CK_MUSIC_RING 32

/* One command the game staged at $1E00-$1E03 before JSL $C7:0004 (cmd $10 play, $11 resume, $81 fade, $18-$2F effects). */
typedef struct {
  uint8_t cmd, p1, p2, p3;   /* p1 is the song id for $10 and $11 */
  uint32_t frame;            /* CkFrameCount when the command was seen */
} CkMusicCmd;

/* What CkMusicState() returns: the commands seen since the last call, then three ARAM bytes read after the frame. */
typedef struct {
  uint32_t seq;              /* total commands ever logged (wraps), so a reader can tell it missed some */
  uint32_t dropped;          /* commands lost to a full ring since the last call */
  uint32_t count;            /* entries in ring[] */
  uint8_t song;              /* ARAM $80  D_SONG       the song playing ($FF none)          (sound/driver.c) */
  uint8_t sfxVoices;         /* ARAM $86  D_SFX_VOICES the voices the effects own */
  uint8_t fade;              /* ARAM $F161 music fade, the high byte of the music master volume */
  uint8_t valid;             /* 1 once the audio object has been seen (the ARAM bytes are real) */
  CkMusicCmd ring[CK_MUSIC_RING];
} CkMusicStateT;

/* Voice-group gains for the patched mixer (wasm-build/patches/mixer-gains.mjs): 256 is unchanged, 0 is silent. Index 0 the
   music voices, 1 the effect voices (those D_SFX_VOICES marks). Not part of any save state. */
extern int g_ckGain[2];

const CkMusicStateT* ck_music_state(void);   /* snapshot, then empties the ring */

#ifdef __cplusplus
}
#endif
#endif
