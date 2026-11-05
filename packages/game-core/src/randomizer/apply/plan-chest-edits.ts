/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import {
  CTAS_TYPE_TABLE, TREASURE_BANK_ROM, TREASURE_ITEM_MASK, TREASURE_POINTERS_ROM, TREASURE_RECORD_BYTES,
} from '../checks/checks.constants';
import { shiftItemByDifficulty } from '../world/treasure-tiers/shift-item-by-difficulty';
import type { ItemDifficulty } from '../world/treasure-tiers/treasure-tier.type';
import { readPackEntries } from '../checks/read-pack-entries';
import type { PackEntry } from '../checks/read-pack-entries.type';
import { CHEST_PAYLOAD_AT, ITEM_HIGH_BIT, MAX_AWARD_ITEM } from './apply.constants';
import type { EditPlan, PackEdit, Placement } from './apply-seed.type';

const coveringTables = (tables: PackEntry[], rom: number): PackEntry[] =>
  tables.filter((t) => rom >= t.id && rom < t.id + t.length);

const romByte = (pack: Uint8Array, tables: PackEntry[], rom: number): number | null => {
  const t = coveringTables(tables, rom)[0];
  return t ? (pack[t.start + rom - t.id] ?? null) : null;
};

const wordFrom = (pack: Uint8Array, tables: PackEntry[], rom: number): number | null => {
  const lo = romByte(pack, tables, rom);
  const hi = romByte(pack, tables, rom + 1);
  return lo === null || hi === null ? null : lo | (hi << 8);
};

const payloadRom = (pack: Uint8Array, tables: PackEntry[], check: CheckDef): number | null => {
  const [, locHex, nText] = check.id.split('-');
  const loc = Number.parseInt(locHex ?? '', 16);
  const n = Number.parseInt(nText ?? '', 10);
  const beg = Number.isNaN(loc) || Number.isNaN(n) ? null : wordFrom(pack, tables, TREASURE_POINTERS_ROM + loc * 2);
  return beg === null ? null : TREASURE_BANK_ROM + beg + n * TREASURE_RECORD_BYTES + CHEST_PAYLOAD_AT;
};

const byteEdits = (tables: PackEntry[], rom: number, change: { old: number; next: number }, why: string): PackEdit[] =>
  coveringTables(tables, rom).map((t) => ({ at: t.start + rom - t.id, old: change.old, next: change.next, why }));

const chestEdits = (pack: Uint8Array, tables: PackEntry[], check: CheckDef, item: number): PackEdit[] => {
  const rom = payloadRom(pack, tables, check);
  const word = rom === null ? null : wordFrom(pack, tables, rom);
  if (rom === null || word === null || (word & TREASURE_ITEM_MASK) !== check.vanillaItem) return [];
  const high = word >> 8;
  return [
    ...byteEdits(tables, rom, { old: word & 0xff, next: item }, check.id),
    ...byteEdits(tables, rom + 1, { old: high, next: high & ~ITEM_HIGH_BIT }, check.id),
  ];
};

const planChestEdits = (
  pack: Uint8Array, checks: CheckDef[], placement: Placement, difficulty: ItemDifficulty = 'normal',
): EditPlan => {
  const tables = readPackEntries(pack).filter((e) => e.type === CTAS_TYPE_TABLE);
  const plan: EditPlan = { edits: [], failed: [] };
  checks.forEach((check) => {
    const placed = placement[check.id];
    const item = placed ?? shiftItemByDifficulty(check.vanillaItem, difficulty, check.id);
    if (placed === undefined && item === check.vanillaItem) return;
    const edits = item >= 1 && item <= MAX_AWARD_ITEM ? chestEdits(pack, tables, check, item) : [];
    if (edits.length > 0) plan.edits.push(...edits);
    else plan.failed.push(check.id);
  });
  return plan;
};

export { planChestEdits };
