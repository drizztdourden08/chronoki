/* ChronoKi multiworld (Archipelago) hooks: what reconnect/ap_reconnect.c shares with wasm-build/ck_api.c and the engine
   files the build patches (wasm-build/patches/ap-foreign-item.mjs, ap-death-link.mjs, ap-save-bytes.mjs). The same
   contract as RotP's core/game-hooks (foreign_item.c, death_link.c, ap_received_index.c, ap_room_hash.c), on CT's engine.

   Gates: everything here is off unless the host raised CkSetApOnline(1) (a multiworld session is active); death link
   also needs CkSetApDeathLink(1). Off, every patched call site runs the original code: vanilla and the single-player
   randomizer are byte-identical. The kill arm, the foreign names and the event ring are session state, never saved. */
#ifndef CK_AP_H
#define CK_AP_H
#include <stdint.h>
#ifdef __cplusplus
extern "C" {
#endif

/* The foreign item: a location whose item belongs to another player. CT item ids run 0x01..0xF1
   (treasure-tiers.constants.ts LAST_ITEM_ID), so 0xFE is free; RotP uses the same value. */
#define CK_AP_FOREIGN_ITEM 0xFE

/* Event kinds in the ring CkApTakeEvents returns. */
#define CK_AP_EV_CHEST 1   /* a chest opened: loc, a = record n (chest-LLL-n), b = flag index, item = payload word */
#define CK_AP_EV_GIFT  2   /* an add-item op 0xCA ran: loc, a = object (gift-LLL-oN), b = operand offset (patchAt), item */
#define CK_AP_EV_DEATH 3   /* the party was wiped and the game over began: a = cause (0 game, 1 the host's kill) */
#define CK_AP_RING 64

typedef struct { int32_t kind, loc, a, b, item; } CkApEvent;

/* What CkApTakeEvents() returns: the events since the last call. */
typedef struct {
  uint32_t seq;        /* total events ever logged (wraps) */
  uint32_t dropped;    /* events lost to a full ring since the last call */
  uint32_t count;      /* entries in ev[] */
  CkApEvent ev[CK_AP_RING];
} CkApEventsT;

/* Name keys for ck_ap_set_foreign_name: kind 0 = the default line (any foreign location without its own), 1 = a chest
   (loc, record n), 2 = a gift (loc, operand offset patchAt). */
#define CK_AP_NAME_DEFAULT 0
#define CK_AP_NAME_CHEST   1
#define CK_AP_NAME_GIFT    2
#define CK_AP_NAME_LEN     48

int  ck_ap_online(void);
int  ck_ap_death_link(void);
void ck_ap_set_online(int on);
void ck_ap_set_death_link(int on);

void ck_ap_set_foreign_name(int kind, int loc, int key, const char* text);   /* "" removes the entry */
void ck_ap_clear_foreign_names(void);
const char* ck_ap_foreign_line(void);      /* ASCII: the line of the foreign location opened last ("<item> for <player>") */

/* field.c fieldTreasureProbe: a chest's opened bit was just set (every payload kind). Selects the foreign line. */
void ck_ap_chest_opened(int loc, int record, int idx, int payload);
/* ct_vm.c, both CtVmItemFamily call sites: CtVmItemFamily unchanged when offline; online, an 0xCA reports a gift and a
   0xCA of the foreign item runs the op's exits without the inventory leaf. rawOp = the op's offset in the script entry. */
int  ckApItemFamily(uint8_t* r, const uint8_t* script, int ip, int* outIp, int obj, int rawOp);
/* ct_vm.c {item}: the foreign line in CT charset (the textbox renderer's bytes) into out; returns the new length. */
int  ck_ap_foreign_line_ct(char* out, int o, int cap);

/* Death link. */
int  ck_ap_kill_party(void);               /* CkApKillParty: arm (1), refused when the gate is off (0) */
void ck_ap_set_kill_landing(int mode);     /* 0 (default) the next battle frame / staging; 1 also a field game over now */
void ck_ap_kill_battle_begin(uint8_t* mem);   /* battle.c staging: clears the per-battle cause, lands an arm */
void ck_ap_kill_battle_tick(uint8_t* mem);    /* battle.c CtBattleTick head, a fight still running: lands an arm */
int  ck_ap_field_kill_due(void);           /* field.c main loop, landing 1, not in a battle: 1 = start the game over */
void ck_ap_party_wiped(void);              /* field.c, the battle game-over commit: reports CK_AP_EV_DEATH */
const CkApEventsT* ck_ap_take_events(void);

/* The received-item index and the room hash (RotP WasmGet/SetApReceivedIndex u16, WasmGet/SetApRoomHash u32, 0 = no
   room). Kept in each save slot's unused SRAM tail (menu.c patches) and in the save-state stamp (ck_state.c). */
unsigned ck_ap_received_index(void);
void ck_ap_set_received_index(unsigned v);
uint32_t ck_ap_room_hash(void);
void ck_ap_set_room_hash(uint32_t v);
void ck_ap_sram_put(uint8_t* slot);        /* menu.c CtMenuSaveWrite, before the checksum: slot = sram + base */
void ck_ap_sram_get(const uint8_t* slot);  /* menu.c CtMenuSaveLoad */
void ck_ap_new_game(void);                 /* menu.c CtMenuNewGameWipe: the index back to 0 */
int  ck_ap_stamp_put(char* out, int cap);  /* ck_state.c save: appends "ap=<index>,<hash>\n" when online; returns length */
void ck_ap_stamp_stage(const uint8_t* stamp, uint32_t len);   /* ck_state.c request_load: the staged state's ap= line */
void ck_ap_stamp_apply(void);              /* ck_state.c load ok: online, the staged values (absent line: 0, 0) */

#ifdef __cplusplus
}
#endif
#endif
