/* [chronoki] Visible Techs (patches/visible-techs.mjs): helpers for the menu.c copy. Display only: nothing here writes
   WRAM, and every caller is gated by ck_visible_techs(). Included into menu.c before CtMenuTechFieldUsable. */

/* A single tech (ids 0x01..0x38, eight per character) whose learned bit ($7E:2837 + charId, bit 7 = first tech) is clear. */
static int ckTechUnlearned(const uint8_t* mem, int techId) {
  if (!mem || techId < 1 || techId > 0x38) return 0;
  int k = techId - 1;
  return !(mem[0x2837 + (k >> 3)] & (0x80 >> (k & 7)));
}

/* TP still needed for an unlearned single: the sheet's +0x2D/+0x2E (the next tech's remaining TP) plus the full cost of
   each tech after it up to this one. Cost of tech j = u16 at CC/26FA + charId * 16 + j * 2 (C1/F3E7). */
static int ckTechNeed(const CtMenuHost* h, int charId, int techId, const uint8_t* sh) {
  int need = sh[0x2D] | (sh[0x2E] << 8);
  if (!h->rom || h->romLen < 0x0C2800L || techId < 1 || techId > 0x38) return need;
  int next = 0;                                        /* the first unlearned tech: what the sheet's TP is for */
  while (next < 8 && (h->mem[0x2837 + (charId & 7)] & (0x80 >> next))) next++;
  for (int j = next + 1; j <= ((techId - 1) & 7); j++) {
    long a = 0x0C26FAL + (charId & 7) * 16 + j * 2;
    need += CtRomByte(h->rom, 0x400000L, a) | (CtRomByte(h->rom, 0x400000L, a + 1) << 8);
  }
  return need > 99999 ? 99999 : need;
}
