/* ChronoKi multiworld (Archipelago) hooks, host side of the patched engine files (ck_ap.h has the contract).

   Foreign item. A chest or a gift holding CK_AP_FOREIGN_ITEM (0xFE) behaves as for any item, flag and text included, but
   nothing enters the inventory, and the location is reported (CK_AP_EV_CHEST / CK_AP_EV_GIFT) so the host sends the
   check. The line shown in place of the item name is the host's ("<item> for <player>"), set per location beforehand
   (CkSetForeignName), because the chest's text is built in the frame it opens.
   Death link. The battle game-over commit (field.c) reports the wipe with cause 1 when the host's kill caused it. A kill
   (CkApKillParty) lands on the next battle frame: in a fight, that frame; on the field, the next fight's staging (Q2's
   default), or with landing 1 a field game over at once. The kill writes 0 to every present PC's battle curHP, the
   block battle.c's own CT_BATTLE_PCHP test hook writes for "a party wipe for the C0/02A0 game-over path".
   Save bytes. CT's eight save records (menu.c CT_SAVE_RECS) fill slot +0x0000..+0x0833 of each 0x0A00 slot; +0x0834..
   +0x09FF is written by nobody, read by no load or summary, and only covered by the slot checksum (FF/FBE7). The index
   and hash go there under the gate, stamped with the slot's own "Save #" so a later offline save of the slot, which
   bumps that counter and leaves the tail alone, reads back as no data. */
#include "ck_ap.h"
#include "move.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int g_online = 0, g_deathLink = 0;

int ck_ap_online(void) { return g_online; }
int ck_ap_death_link(void) { return g_online && g_deathLink; }

/* ---- Foreign names ---- */
#define CK_AP_NAMES_MAX 1024
typedef struct { uint8_t kind; uint16_t loc, key; char text[CK_AP_NAME_LEN]; } NameEntry;
static NameEntry g_names[CK_AP_NAMES_MAX];
static int g_nameCount = 0;
static char g_default[CK_AP_NAME_LEN] = "an item for another world";
static const char* g_line = g_default;

static int findName(int kind, int loc, int key) {
  for (int i = 0; i < g_nameCount; i++)
    if (g_names[i].kind == kind && g_names[i].loc == loc && g_names[i].key == key) return i;
  return -1;
}

void ck_ap_set_foreign_name(int kind, int loc, int key, const char* text) {
  const char* t = text ? text : "";
  if (kind == CK_AP_NAME_DEFAULT) { snprintf(g_default, sizeof g_default, "%s", t); return; }
  int i = findName(kind, loc & 0xFFFF, key & 0xFFFF);
  if (!*t) {                                       /* remove: the last entry fills the hole */
    if (i >= 0) { g_line = g_default; g_names[i] = g_names[--g_nameCount]; }
    return;
  }
  if (i < 0) {
    if (g_nameCount >= CK_AP_NAMES_MAX) return;
    i = g_nameCount++;
    g_names[i].kind = (uint8_t)kind; g_names[i].loc = (uint16_t)loc; g_names[i].key = (uint16_t)key;
  }
  snprintf(g_names[i].text, sizeof g_names[i].text, "%s", t);
}

void ck_ap_clear_foreign_names(void) { g_nameCount = 0; g_line = g_default; }

static void selectLine(int kind, int loc, int key) {
  int i = findName(kind, loc, key);
  g_line = i >= 0 ? g_names[i].text : g_default;
}

const char* ck_ap_foreign_line(void) { return g_line; }

/* The textbox renderer draws CT charset bytes (ct_vm.c {item}: 0xA0-0xF3 raw, ' ' the blank): field.c fieldCtChar
   inverted. A character CT has no glyph for becomes a blank. */
static char ctOf(char c) {
  static const char punct[] = "!?/\"\":&()'.,=-+%";   /* 0xDE.. (0xE1 and 0xE2 are both '"': the first is used) */
  if (c >= 'A' && c <= 'Z') return (char)(0xA0 + (c - 'A'));
  if (c >= 'a' && c <= 'z') return (char)(0xBA + (c - 'a'));
  if (c >= '0' && c <= '9') return (char)(0xD4 + (c - '0'));
  if (c == '#') return (char)0xF3;
  const char* p = c ? strchr(punct, c) : NULL;
  return p ? (char)(0xDE + (p - punct)) : ' ';
}

int ck_ap_foreign_line_ct(char* out, int o, int cap) {
  for (const char* t = g_line; *t && o < cap - 1; t++) out[o++] = ctOf(*t);
  return o;
}

/* ---- Events ---- */
static CkApEvent g_ring[CK_AP_RING];
static CkApEventsT g_snap;
static uint32_t g_count = 0, g_seq = 0, g_dropped = 0;

static void push(int kind, int loc, int a, int b, int item) {
  g_seq++;
  if (g_count >= CK_AP_RING) { g_dropped++; return; }
  g_ring[g_count++] = (CkApEvent){ kind, loc, a, b, item };
}

const CkApEventsT* ck_ap_take_events(void) {
  g_snap.seq = g_seq; g_snap.dropped = g_dropped; g_snap.count = g_count;
  memcpy(g_snap.ev, g_ring, g_count * sizeof g_ring[0]);
  g_count = 0; g_dropped = 0;
  return &g_snap;
}

void ck_ap_chest_opened(int loc, int record, int idx, int payload) {
  if (!g_online) return;
  push(CK_AP_EV_CHEST, loc, record, idx, payload);
  selectLine(CK_AP_NAME_CHEST, loc & 0xFFFF, record & 0xFFFF);
}

/* move.c CtVmItemFamily's 0xCA arm (C0/37B1): spill = ip + 2 to $01C7, then leaf 1 (C1/D005 AddItem) through the gate,
   whose first store is $AEF7 = the id; the op exits at the spill. The foreign item keeps those writes and skips the leaf,
   and puts the id in local 0 ($7F:0200), the {item} code's source (ct_vm.c, C2/5B9B), so a following line names it. */
int ckApItemFamily(uint8_t* r, const uint8_t* script, int ip, int* outIp, int obj, int rawOp) {
  if (!g_online || script[ip] != 0xCA) return CtVmItemFamily(r, script, ip, outIp);
  int item = script[(ip + 1) & 0xFFFF];
  int loc = (r[0x0100] | (r[0x0101] << 8)) & 0x01FF;
  int patchAt = rawOp + 1;
  push(CK_AP_EV_GIFT, loc, obj, patchAt, item);
  if (item != CK_AP_FOREIGN_ITEM) return CtVmItemFamily(r, script, ip, outIp);
  selectLine(CK_AP_NAME_GIFT, loc, patchAt & 0xFFFF);
  int spill = (ip + 2) & 0xFFFF;
  r[0x01C7] = (uint8_t)spill; r[0x01C8] = (uint8_t)(spill >> 8);   /* 37BA STX $C7 */
  r[0xAEF7] = (uint8_t)item; r[0xAEF8] = 0;                         /* C1/CFC2 gate: STY $AEF7 */
  r[0x10200] = (uint8_t)item; r[0x10201] = 0;                       /* local 0 = $7F:0200 */
  *outIp = spill;                                                   /* 37C3 LDX $C7 / SEC */
  return 1;
}

/* ---- Death link ---- */
static const int kPcBlock[3] = { 0x5E2D, 0x5EAD, 0x5F2D };   /* battle.c kPcBlock: curHP at block +0x03/+0x04 */
static int g_killArmed = 0, g_killApplied = 0, g_landing = 0;

static void dropArm(void) { g_killArmed = 0; g_killApplied = 0; }

void ck_ap_set_online(int on) { g_online = on != 0; if (!g_online) dropArm(); }
void ck_ap_set_death_link(int on) { g_deathLink = on != 0; if (!g_deathLink) dropArm(); }

int ck_ap_kill_party(void) {
  if (!ck_ap_death_link()) return 0;
  g_killArmed = 1;
  return 1;
}

void ck_ap_set_kill_landing(int mode) { g_landing = mode == 1 ? 1 : 0; }

static void wipe(uint8_t* mem) {
  for (int seat = 0; seat < 3; seat++) if (!(mem[0x2980 + seat] & 0x80)) {
    mem[kPcBlock[seat] + 3] = 0; mem[kPcBlock[seat] + 4] = 0;
  }
  g_killArmed = 0; g_killApplied = 1;
}

void ck_ap_kill_battle_begin(uint8_t* mem) {
  if (!ck_ap_death_link()) { dropArm(); return; }
  g_killApplied = 0;
  if (g_killArmed && mem) wipe(mem);
}

void ck_ap_kill_battle_tick(uint8_t* mem) {
  if (ck_ap_death_link() && g_killArmed && mem) wipe(mem);
}

int ck_ap_field_kill_due(void) {
  if (!ck_ap_death_link() || !g_killArmed || g_landing != 1) return 0;
  g_killArmed = 0; g_killApplied = 0;
  push(CK_AP_EV_DEATH, 0, 1, 0, 0);       /* this game over skips the battle commit: reported here, cause 1 */
  return 1;
}

void ck_ap_party_wiped(void) {
  if (!ck_ap_death_link()) return;
  push(CK_AP_EV_DEATH, 0, g_killApplied ? 1 : 0, 0, 0);
  g_killApplied = 0;
}

/* ---- Received index and room hash ---- */
#define CK_AP_TAIL 0x0834        /* the first slot byte past CT_SAVE_RECS (0x0834 bytes packed) */
#define CK_AP_SAVE_NO 0x059C     /* $7E:299C "Save #" inside record 0 ($7E:2400 + 0x59C) */
static unsigned g_index = 0;
static uint32_t g_hash = 0;
static int g_stagedHas = 0;
static unsigned g_stagedIndex = 0;
static uint32_t g_stagedHash = 0;

unsigned ck_ap_received_index(void) { return g_index; }
void ck_ap_set_received_index(unsigned v) { g_index = v & 0xFFFFu; }
uint32_t ck_ap_room_hash(void) { return g_hash; }
void ck_ap_set_room_hash(uint32_t v) { g_hash = v; }

void ck_ap_sram_put(uint8_t* slot) {
  uint8_t* t = slot + CK_AP_TAIL;
  memcpy(t, "CKAP", 4);
  t[4] = slot[CK_AP_SAVE_NO]; t[5] = slot[CK_AP_SAVE_NO + 1];
  t[6] = (uint8_t)g_index; t[7] = (uint8_t)(g_index >> 8);
  for (int k = 0; k < 4; k++) t[8 + k] = (uint8_t)(g_hash >> (8 * k));
}

void ck_ap_sram_get(const uint8_t* slot) {
  const uint8_t* t = slot + CK_AP_TAIL;
  if (memcmp(t, "CKAP", 4) || t[4] != slot[CK_AP_SAVE_NO] || t[5] != slot[CK_AP_SAVE_NO + 1]) {
    g_index = 0; g_hash = 0; return;
  }
  g_index = (unsigned)t[6] | ((unsigned)t[7] << 8);
  g_hash = (uint32_t)t[8] | ((uint32_t)t[9] << 8) | ((uint32_t)t[10] << 16) | ((uint32_t)t[11] << 24);
}

void ck_ap_new_game(void) { g_index = 0; }

int ck_ap_stamp_put(char* out, int cap) {
  if (!g_online || !out || cap <= 0) return 0;
  int n = snprintf(out, (size_t)cap, "ap=%u,%lu\n", g_index, (unsigned long)g_hash);
  return n > 0 && n < cap ? n : 0;
}

void ck_ap_stamp_stage(const uint8_t* stamp, uint32_t len) {
  g_stagedHas = 0; g_stagedIndex = 0; g_stagedHash = 0;
  for (uint32_t i = 0; stamp && i + 3 <= len; i++) {
    if ((i && stamp[i - 1] != '\n') || memcmp(stamp + i, "ap=", 3)) continue;
    char line[40]; uint32_t n = 0;
    for (uint32_t e = i + 3; e < len && stamp[e] != '\n' && n < sizeof line - 1; e++) line[n++] = (char)stamp[e];
    line[n] = 0;
    char* comma = strchr(line, ',');
    if (!comma) return;
    g_stagedIndex = (unsigned)strtoul(line, NULL, 10) & 0xFFFFu;
    g_stagedHash = (uint32_t)strtoul(comma + 1, NULL, 10);
    g_stagedHas = 1;
    return;
  }
}

void ck_ap_stamp_apply(void) {
  if (!g_online) return;
  g_index = g_stagedHas ? g_stagedIndex : 0;
  g_hash = g_stagedHas ? g_stagedHash : 0;
}
