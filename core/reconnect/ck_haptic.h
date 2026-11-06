/* ChronoKi haptics (controller rumble), I-119: what reconnect/haptic_reconnect.c shares with wasm-build/ck_api.c and the
   engine file the build patches (wasm-build/patches/haptic-events.mjs). The same job as RotP's core/game-hooks/haptic_events.c
   (an event source the host turns into vibration), on CT's engine: the battle tick reports what it saw as a ring the host polls.

   Gate: everything here is off unless the host raised CkSetHaptics(1). Off, the patched call site is one test of ck_haptic_on()
   and nothing else: no state is kept, nothing is logged, no timing changes. The ring and the battle snapshot are session state,
   never saved in a save state. A host-side read only: the engine's own bytes are never written. */
#ifndef CK_HAPTIC_H
#define CK_HAPTIC_H
#include <stdint.h>
#ifdef __cplusplus
extern "C" {
#endif

/* Event kinds in the ring CkHapticPoll returns. Keep in step with HapticEventType in
   packages/input-mapping/src/haptic-events/haptic-events.constants.ts. */
#define CK_HAPTIC_DAMAGE_TAKEN   1   /* a party member lost HP in battle: param = the party's HP loss as a percent of the lost member's max HP, 1..100 */
#define CK_HAPTIC_ENEMY_DEFEATED 2   /* an enemy fell in battle (curHP 0 and delisted from the alive list): param 0 */
#define CK_HAPTIC_RING 32

typedef struct { int32_t kind, param; } CkHapticEvent;

/* What CkHapticPoll() returns: the events since the last call. */
typedef struct {
  uint32_t seq;        /* total events ever logged (wraps) */
  uint32_t dropped;    /* events lost to a full ring since the last call */
  uint32_t count;      /* entries in ev[] */
  CkHapticEvent ev[CK_HAPTIC_RING];
} CkHapticEventsT;

int  ck_haptic_on(void);
void ck_haptic_set(int on);                                  /* CkSetHaptics: 0 also empties the ring and drops the snapshot */
/* battle.c CtBattleTick, after the frame's body, only when ck_haptic_on(): mem = the battle WRAM, frames = CtBattleHost.frames. */
void ck_haptic_battle_tick(const uint8_t* mem, int frames);
const CkHapticEventsT* ck_haptic_take(void);                 /* CkHapticPoll: the ring since the last call, then emptied */

#ifdef __cplusplus
}
#endif
#endif
