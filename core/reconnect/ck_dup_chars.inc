/* [chronoki] Duplicate characters (character rando sub-option, ini [chronoki] duplicate_characters): the shared helpers
   the patched engine files call (wasm-build/patches/duplicate-chars.mjs, duplicate-chars-battle.mjs). Included once, by
   settings_reconnect.c (it owns g_dupChars); declared in ck_reconnect.h.
   The model: a party byte ($7E:2980..2988) is a SLOT (story identity: sheet, name, locks, learned techs, TP), and sheet
   byte +0x00 ($7E:2600 + slot * 0x50) is its KIND (looks, attack, tech list, growth, equipment). Vanilla keeps the two
   equal; every patched site is `ck_dup_chars() ? <kind> : <original>`, so the gate off is the original game, and the
   gate on with an identity table gives the original values too. Nothing here writes WRAM. */

int ck_dup_chars(void) { return g_dupChars; }

/* The kind shown and fought with for slot `slot`: the sheet's byte +0x00. The slot itself when the gate is off, the slot
   is not a character (an empty $80, 7 = Epoch, negative) or the byte is not a character id (>= 7). */
int ckPcKind(const uint8_t* wram, int slot) {
  if (!g_dupChars || !wram || slot < 0 || slot > 6) return slot;
  int k = wram[0x2600 + slot * 0x50];
  return k < 7 ? (k & 7) : slot;
}

/* A battle seat's slot: $AEFF + seat (the staged copy $AF0A + seat when the live byte is cleared, a fallen seat). 0xFF
   when the seat holds no character. `s` is the battle's view of bank $7E. */
int ckSlotOfSeat(const uint8_t* s, int seat) {
  if (!s || seat < 0 || seat > 2) return 0xFF;
  int id = s[0xAEFF + seat];
  if (id >= 7) id = s[0xAF0A + seat];
  return id < 7 ? id : 0xFF;
}

/* The seat a tech participant of character (kind) `ch` resolves to. Vanilla: $B1BE + ch, the character -> seat map.
   Duplicates: the seat that confirmed the command ($B3F4, written only at C1/B9C1) when its kind is `ch` (each of two
   Cronos casts his own techs), else $B1BE + ch, which the battle builds by kind with the lowest seat winning. $B18B is
   not used: it is rewritten per participant. */
int ckTechSeat(const uint8_t* s, int ch) {
  if (!g_dupChars || !s || ch < 0 || ch > 6) return s ? s[0xB1BE + ch] : 0xFF;
  int a = s[0xB3F4];
  if (a < 3) {
    int slot = ckSlotOfSeat(s, a);
    if (slot != 0xFF && ckPcKind(s, slot) == ch) return a;
  }
  return s[0xB1BE + ch];
}

/* An item's equip mask (bit 0x80 >> kind) turned into a mask by slot (bit 0x80 >> slot): slot s gets its kind's bit.
   Bit 0x01 (id 7) is kept. Menu "Can be used by" (C2/AEB6). */
int ckKindMaskToSlots(const uint8_t* wram, int kindMask) {
  int out = kindMask & 0x01;
  for (int s = 0; s < 7; s++)
    if (kindMask & (0x80 >> ckPcKind(wram, s))) out |= 0x80 >> s;
  return out;
}

/* FF/F865's roster mask by kind: bit 0x80 >> kind set = no roster slot ($2980..$2988) shows that kind. */
int ckKindAbsent(const uint8_t* wram) {
  int absent = 0xFE;
  if (!wram) return absent;
  for (int i = 0; i < 9; i++) {
    int e = wram[0x2980 + i];
    if (!(e & 0x80)) absent &= ~(0x80 >> (ckPcKind(wram, e & 7) & 7));
  }
  return absent;
}

/* The first roster slot ($2980..$2988, present) of kind `kind` other than `notSlot`; 7 when there is none (no roster
   byte reads 7, so a search for it finds nothing). A Dual / Triple partner panel in the Tech menu. */
int ckRosterSlotOfKind(const uint8_t* wram, int kind, int notSlot) {
  if (!wram) return 7;
  for (int i = 0; i < 9; i++) {
    int e = wram[0x2980 + i];
    if ((e & 0x80) || (e & 7) == notSlot) continue;
    if (ckPcKind(wram, e & 7) == kind) return e & 7;
  }
  return 7;
}

/* The kind a saved sheet (SRAM, the load screen's preview) shows: its byte +0x00, or the slot. */
int ckSheetKind(const uint8_t* sheet, int slot) {
  if (!g_dupChars || !sheet || slot < 0 || slot > 6) return slot;
  return sheet[0] < 7 ? sheet[0] : slot;
}

/* The engine's own new-game defaults (ct_vm.c's g_ctName), by kind. */
static const char* const kCkDefaultName[7] = { "Crono", "Marle", "Lucca", "Robo", "Frog", "Ayla", "Magus" };

/* The default name a slot is proposed: its kind's, or NULL when the slot shows itself (keep the original). */
const char* ckKindDefaultName(const uint8_t* wram, int slot) {
  if (!g_dupChars || slot < 0 || slot > 6) return NULL;
  int k = ckPcKind(wram, slot);
  return (k >= 0 && k < 7 && k != slot) ? kCkDefaultName[k] : NULL;
}

/* At the new-game wipe (menu.c CtMenuNewGameWipe, once the sheets hold their kinds): each slot shown as another kind
   starts with that kind's default name (CtGetName, the dialogue's names). The player's own name still replaces it at the
   naming screen; nothing changes for a slot that shows itself. */
void CtSetName(int id, const char* name);
void ckDupDefaultNames(const uint8_t* wram) {
  for (int s = 0; s < 7; s++) {
    const char* nm = ckKindDefaultName(wram, s);
    if (nm) CtSetName(s, nm);
  }
}
