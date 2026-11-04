/* @layer bridge-wasm @kind logic */
import type { CheckDef } from './check.type';
import {
  CHEST_BITS_BYTES, CHEST_BITS_WRAM, CHEST_ID_PREFIX, TREASURE_BANK_ROM, TREASURE_EMPTY_BIT, TREASURE_GOLD_BIT,
  TREASURE_ITEM_MASK, TREASURE_LOCATIONS, TREASURE_POINTERS_ROM, TREASURE_RECORD_BYTES,
} from './checks.constants';
import type { RomView } from './create-pack-rom-view';
import { createPackRomView } from './create-pack-rom-view';

const wordAt = (rom: RomView, at: number): number | null => {
  const lo = rom(at);
  const hi = rom(at + 1);
  return lo === null || hi === null ? null : lo | (hi << 8);
};

const chestCheck = (loc: number, n: number, idx: number, tile: number, payload: number): CheckDef => ({
  id: `${CHEST_ID_PREFIX}-${loc.toString(16).padStart(3, '0')}-${n}`,
  kind: 'chest',
  locationId: loc,
  tile: { x: tile & 0xff, y: tile >> 8 },
  probe: { region: 'wram', offset: CHEST_BITS_WRAM + ((idx >> 3) % CHEST_BITS_BYTES), mask: 1 << (idx & 7), compare: 'set' },
  vanillaItem: payload & TREASURE_ITEM_MASK,
});

const isItemPayload = (payload: number): boolean => (payload & (TREASURE_GOLD_BIT | TREASURE_EMPTY_BIT)) === 0;

const locationChecks = (rom: RomView, loc: number, base: number): CheckDef[] => {
  const beg = wordAt(rom, TREASURE_POINTERS_ROM + loc * 2);
  const end = wordAt(rom, TREASURE_POINTERS_ROM + loc * 2 + 2);
  if (beg === null || end === null || wordAt(rom, TREASURE_BANK_ROM + beg) === 0) return [];
  const checks: CheckDef[] = [];
  for (let off = beg, n = 0; off + TREASURE_RECORD_BYTES <= end; off += TREASURE_RECORD_BYTES, n += 1) {
    const tile = wordAt(rom, TREASURE_BANK_ROM + off);
    const payload = wordAt(rom, TREASURE_BANK_ROM + off + 2);
    if (tile === null || payload === null || !isItemPayload(payload)) continue;
    checks.push(chestCheck(loc, n, (off - base) / TREASURE_RECORD_BYTES, tile, payload));
  }
  return checks;
};

const deriveChestChecks = (pack: Uint8Array): CheckDef[] => {
  const rom = createPackRomView(pack);
  const base = rom ? wordAt(rom, TREASURE_POINTERS_ROM) : null;
  if (!rom || base === null) return [];
  const checks: CheckDef[] = [];
  for (let loc = 0; loc < TREASURE_LOCATIONS; loc += 1) checks.push(...locationChecks(rom, loc, base));
  return checks;
};

export { deriveChestChecks };
