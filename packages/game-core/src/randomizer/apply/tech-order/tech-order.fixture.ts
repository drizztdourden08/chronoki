/* @layer bridge-wasm @kind fixture */
import {
  CC_MENU_TABLE_NAME, CC_MENU_TABLE_ROM, CONTROL_COUNT, CONTROL_TABLE, DESC_ROW_BYTES, DESC_TABLE_NAME, LEARN_REFS_ROM,
  MENU_MP_REQS_BYTES, MENU_MP_REQS_ROM, MOVED_TABLES, MP_COST_TABLE_NAME, MP_INDEX_TABLE_NAME,
} from './tech-order.constants';

type FixtureEntry = { type: number; id: number; data: number[] };

const LEARN_REQS_ROM = 0x0c27fa;
const LEARN_REQ_COUNT = 18;
const MENU_COPY_BYTES = 0x1a1d;
const TABLE_RECORDS = 0x39;
const REFS = [0xc0, 0x39, 3, 0xfa, 0x27, 0xa0, 0x3c, 3, 0x03, 0x28, 0xff];

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const controlByte = (addr: number): number => {
  const k = Math.floor((addr - CONTROL_TABLE.rom) / CONTROL_TABLE.size);
  const b = (addr - CONTROL_TABLE.rom) % CONTROL_TABLE.size;
  if (b === 0) return (k & 0x7f) | (k % 3 === 0 ? 0x80 : 0);
  if (b >= 5 && b <= 7) return (((k + b) % 0x38) + 1) | (k % 5 === 0 ? 0x80 : 0);
  return (addr * 13 + 1) & 0xff;
};

const romByte = (addr: number): number => {
  const control = addr >= CONTROL_TABLE.rom && addr < CONTROL_TABLE.rom + CONTROL_COUNT * CONTROL_TABLE.size;
  if (control) return controlByte(addr);
  if (addr >= LEARN_REFS_ROM && addr < LEARN_REFS_ROM + REFS.length) return REFS[addr - LEARN_REFS_ROM] ?? 0;
  if (addr >= LEARN_REQS_ROM && addr < LEARN_REQS_ROM + LEARN_REQ_COUNT) return (((addr - LEARN_REQS_ROM) * 3) % 8) + 1;
  if (addr >= MENU_MP_REQS_ROM && addr < MENU_MP_REQS_ROM + MENU_MP_REQS_BYTES) return ((addr - MENU_MP_REQS_ROM) % 0x38) + 1;
  return (addr * 31 + 7) & 0xff;
};

const slice = (rom: number, length: number): number[] => Array.from({ length }, (_, i) => romByte(rom + i));

const namedEntry = (name: string, data: number[]): FixtureEntry => {
  const sizeAt = Math.ceil((1 + name.length) / 4) * 4;
  const head = new Array<number>(sizeAt + 16).fill(0);
  head[0] = name.length;
  [...name].forEach((ch, i) => { head[1 + i] = ch.charCodeAt(0); });
  le32(data.length).forEach((b, i) => { head[sizeAt + i] = b; });
  return { type: 65, id: 0xb0, data: [...head, ...data] };
};

const romEntries = (): FixtureEntry[] => [
  ...MOVED_TABLES.map((t) => ({ type: 37, id: t.rom, data: slice(t.rom, TABLE_RECORDS * t.size) })),
  { type: 37, id: CONTROL_TABLE.rom, data: slice(CONTROL_TABLE.rom, CONTROL_COUNT * CONTROL_TABLE.size) },
  { type: 37, id: LEARN_REFS_ROM, data: REFS },
  { type: 37, id: LEARN_REQS_ROM, data: slice(LEARN_REQS_ROM, LEARN_REQ_COUNT) },
  { type: 37, id: MENU_MP_REQS_ROM, data: slice(MENU_MP_REQS_ROM, MENU_MP_REQS_BYTES) },
];

const menuEntries = (): FixtureEntry[] => [
  namedEntry(CC_MENU_TABLE_NAME, slice(CC_MENU_TABLE_ROM, MENU_COPY_BYTES)),
  namedEntry(MP_COST_TABLE_NAME, Array.from({ length: 256 }, (_, i) => (i * 7) & 0xff)),
  namedEntry(DESC_TABLE_NAME, Array.from({ length: 122 * DESC_ROW_BYTES }, (_, i) => Math.floor(i / DESC_ROW_BYTES))),
  namedEntry(MP_INDEX_TABLE_NAME, Array.from({ length: 472 }, (_, i) => i % 0x39)),
];

const syntheticTechPack = (withMenuTables = true): Uint8Array => {
  const entries = [...romEntries(), ...(withMenuTables ? menuEntries() : [])];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(entries.length)];
  let at = 12 + entries.length * 16;
  entries.forEach((e) => {
    bytes.push(...le32(e.type), ...le32(e.id), ...le32(at), ...le32(e.data.length));
    at += e.data.length;
  });
  entries.forEach((e) => bytes.push(...e.data));
  return Uint8Array.from(bytes);
};

export { syntheticTechPack };
