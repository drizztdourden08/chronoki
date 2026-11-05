/* @layer bridge-wasm @kind fixture */
import { itemRomFixture } from '../../world/treasure-tiers/item-rom.fixture';
import { HEAL_AMOUNT_TABLE, HEAL_KIND_TABLE, HEAL_RECORD_ROM } from '../healing-rando/healing-rando.constants';
import { ATTACK_RECORD_BYTES, ATTACK_RECORD_ROM, LAST_CONTROLLED_TECH_ID } from '../tech-damage/tech-damage.constants';
import { CONTROL_TABLE } from '../tech-order/tech-order.constants';

type Entry = { type: number; id: number; data: number[] };

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const namedEntry = (name: string, data: number[]): Entry => {
  const sizeAt = Math.ceil((1 + name.length) / 4) * 4;
  const head = new Array<number>(sizeAt + 16).fill(0);
  head[0] = name.length;
  [...name].forEach((ch, i) => { head[1 + i] = ch.charCodeAt(0); });
  le32(data.length).forEach((b, i) => { head[sizeAt + i] = b; });
  return { type: 65, id: 0xb0, data: [...head, ...data] };
};

const runsOf = (rom: Map<number, number>): Entry[] => {
  const runs: Entry[] = [];
  [...rom.keys()].sort((a, b) => a - b).forEach((at) => {
    const last = runs[runs.length - 1];
    if (last !== undefined && last.id + last.data.length === at) last.data.push(rom.get(at) ?? 0);
    else runs.push({ type: 37, id: at, data: [rom.get(at) ?? 0] });
  });
  return runs;
};

const HEAL_ROWS: readonly (readonly [number, number, number, number])[] = [
  [1, 1, 1, 50], [2, 1, 4, 50], [3, 1, 10, 50], [4, 2, 1, 10], [5, 2, 3, 10], [6, 2, 6, 10],
];
const HEAL_ENTRY_COUNT = 20;

const gearStats = (rom: Map<number, number>): void => {
  [[1, 5], [2, 20], [3, 50], [4, 7], [5, 8], [6, 9]].forEach(([id, attack]) => rom.set(0x0c0262 + (id ?? 0) * 5, attack ?? 0));
  rom.set(0x0c047e, 30);
  rom.set(0x0c04e1, 20);
  rom.set(0x0c2003, 0xfe);
  rom.set(0x0c3003, 0xfe);
};

const healRecords = (rom: Map<number, number>): void => {
  HEAL_ROWS.forEach(([index, , mult, base]) => {
    [0x80, 0x80, mult, base].forEach((b, i) => rom.set(HEAL_RECORD_ROM + index * 4 + i, b));
  });
};

const ATTACK_ROWS: readonly (readonly [number, number, number])[] = [[1, 1, 10], [2, 3, 20], [3, 2, 8], [4, 5, 40], [5, 1, 30]];
const TECH_REFS: readonly (readonly number[])[] = [[1, 0x80], [2, 0x83], [0x82, 0], [0x84, 0]];

const techRecords = (rom: Map<number, number>): void => {
  for (let i = 0; i < (LAST_CONTROLLED_TECH_ID + 1) * CONTROL_TABLE.size; i += 1) if (!rom.has(CONTROL_TABLE.rom + i)) rom.set(CONTROL_TABLE.rom + i, 0);
  TECH_REFS.forEach((refs, k) => refs.forEach((ref, b) => rom.set(CONTROL_TABLE.rom + (k + 1) * CONTROL_TABLE.size + 5 + b, ref)));
  for (let i = 0; i < 6 * ATTACK_RECORD_BYTES; i += 1) rom.set(ATTACK_RECORD_ROM + i, 0);
  ATTACK_ROWS.forEach(([record, type, power]) => {
    rom.set(ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES + 5, type);
    rom.set(ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES + 9, power);
  });
};

const syntheticBandPack = (withHealTables = true): Uint8Array => {
  const rom = itemRomFixture();
  gearStats(rom);
  healRecords(rom);
  techRecords(rom);
  const kinds = Array.from({ length: HEAL_ENTRY_COUNT }, (_, i) => HEAL_ROWS.find((row) => row[0] === i)?.[1] ?? 0);
  const amounts = Array.from({ length: HEAL_ENTRY_COUNT }, (_, i) => {
    const row = HEAL_ROWS.find((r) => r[0] === i);
    const amount = row === undefined ? 0 : row[2] * row[3];
    return [amount & 0xff, amount >> 8];
  }).flat();
  const entries = [...runsOf(rom), ...(withHealTables ? [namedEntry(HEAL_KIND_TABLE, kinds), namedEntry(HEAL_AMOUNT_TABLE, amounts)] : [])];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(entries.length)];
  let at = 12 + entries.length * 16;
  entries.forEach((e) => {
    bytes.push(...le32(e.type), ...le32(e.id), ...le32(at), ...le32(e.data.length));
    at += e.data.length;
  });
  entries.forEach((e) => bytes.push(...e.data));
  return Uint8Array.from(bytes);
};

export { syntheticBandPack };
