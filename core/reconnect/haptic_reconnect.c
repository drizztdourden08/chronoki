/* ChronoKi haptics event source (ck_haptic.h has the contract). Called once per battle frame, after the engine's tick, only
   while the host raised CkSetHaptics(1). It diffs two things the engine already keeps, so no engine byte is written and no
   new engine hook is needed beyond that one call:
     - the party's curHP (battle.c kPcBlock {5E2D, 5EAD, 5F2D}, curHP at block +3/+4, maxHP at +5/+6; a seat is present when
       $2980+seat has bit 7 clear): a drop is CK_HAPTIC_DAMAGE_TAKEN, scaled to a percent of that member's max HP.
     - the enemy alive list ($AF02+slot, 0xFF = dead or absent; the enemy block is $5FAD + slot*0x80): a slot that was alive
       and is now 0xFF with curHP 0 and not hidden ($AF15 bit 7) is CK_HAPTIC_ENEMY_DEFEATED.
   The snapshot is taken again, with no events, on the first frame of a fight and whenever the frame counter does not advance by
   exactly one (a save state loaded, a new fight), so a load never fires a burst. Boss detection has no reliable engine flag, so
   a boss falling reports as an ordinary enemy. */
#include "ck_haptic.h"
#include <string.h>

#define PC_SEATS 3
#define ENEMY_SLOTS 8

static int g_on = 0;
static CkHapticEventsT g_ring;

static int g_have = 0, g_lastFrames = 0;
static int g_pcHp[PC_SEATS];
static uint8_t g_enAlive[ENEMY_SLOTS];

static int pcBlock(int seat) { return 0x5E2D + seat * 0x80; }
static int enBlock(int slot) { return 0x5FAD + slot * 0x80; }
static int word(const uint8_t* mem, int at) { return mem[at] | (mem[at + 1] << 8); }

int ck_haptic_on(void) { return g_on; }

void ck_haptic_set(int on) {
  g_on = on != 0;
  if (!g_on) { memset(&g_ring, 0, sizeof g_ring); g_have = 0; }
}

static void push(int kind, int param) {
  if (g_ring.count >= CK_HAPTIC_RING) { g_ring.dropped++; return; }
  g_ring.ev[g_ring.count].kind = kind;
  g_ring.ev[g_ring.count].param = param;
  g_ring.count++;
  g_ring.seq++;
}

static void snapshot(const uint8_t* mem) {
  for (int seat = 0; seat < PC_SEATS; seat++) g_pcHp[seat] = word(mem, pcBlock(seat) + 3);
  for (int slot = 0; slot < ENEMY_SLOTS; slot++) g_enAlive[slot] = mem[0xAF02 + slot] != 0xFF;
}

static void diffParty(const uint8_t* mem) {
  for (int seat = 0; seat < PC_SEATS; seat++) {
    int hp = word(mem, pcBlock(seat) + 3);
    int lost = g_pcHp[seat] - hp;
    g_pcHp[seat] = hp;
    if (lost <= 0 || (mem[0x2980 + seat] & 0x80)) continue;
    int max = word(mem, pcBlock(seat) + 5);
    int percent = max > 0 ? lost * 100 / max : 100;
    push(CK_HAPTIC_DAMAGE_TAKEN, percent < 1 ? 1 : percent > 100 ? 100 : percent);
  }
}

static void diffEnemies(const uint8_t* mem) {
  for (int slot = 0; slot < ENEMY_SLOTS; slot++) {
    int alive = mem[0xAF02 + slot] != 0xFF;
    int fell = g_enAlive[slot] && !alive && word(mem, enBlock(slot) + 3) == 0 && !(mem[0xAF15 + slot] & 0x80);
    g_enAlive[slot] = (uint8_t)alive;
    if (fell) push(CK_HAPTIC_ENEMY_DEFEATED, 0);
  }
}

void ck_haptic_battle_tick(const uint8_t* mem, int frames) {
  if (!g_on || !mem) return;
  int steady = g_have && frames == g_lastFrames + 1;
  g_lastFrames = frames;
  g_have = 1;
  if (!steady) { snapshot(mem); return; }
  diffParty(mem);
  diffEnemies(mem);
}

const CkHapticEventsT* ck_haptic_take(void) {
  static CkHapticEventsT out;
  out = g_ring;
  g_ring.count = 0;
  g_ring.dropped = 0;
  return &out;
}
