/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../bytes/byte-reader';
import type { RomTable } from './closure.type';

const FF = 0x3f0000;

/** C2/EF7E's codes 01-0F and the operand bytes their handlers step over (04 is a long pointer to another string). */
const MENU_STRING_OPERANDS = new Map<number, number>([
  [0x01, 0], [0x02, 2], [0x03, 4], [0x04, 3], [0x05, 2], [0x06, 2], [0x07, 2], [0x08, 1],
  [0x09, 1], [0x0a, 1], [0x0b, 4], [0x0c, 3], [0x0d, 0], [0x0e, 0], [0x0f, 0],
]);

/** rom_closure.word_table: 16-bit pointers into `bank` ending where the first target begins: [entries, end]. */
const wordTable = (rom: Uint8Array, at: number, bank: number): [number[], number] => {
  const ts: number[] = [];
  let o = at;
  while (o < bank + Math.min(...ts, 0x10000) && o + 1 < rom.length) {
    ts.push(wordAt(rom, o));
    o += 2;
  }
  return [ts, o];
};

/** rom_closure.menu_string: C2/EF7E's string from `a` to its 00 (its includes walked too); returns the 0C codes' cap indices. */
const menuString = (rom: Uint8Array, start: number, seen: Set<number>, out: RomTable[], depth = 0): number[] => {
  let a = start;
  const caps: number[] = [];
  while (a < rom.length && byteAt(rom, a) !== 0) {
    const c = byteAt(rom, a);
    a += 1;
    if (c >= 0x10) continue;
    if (c === 0x04 && depth < 4 && byteAt(rom, a + 2) >= 0xc0) {
      const inc = ((byteAt(rom, a + 2) - 0xc0) << 16) | wordAt(rom, a);
      if (!seen.has(inc)) {
        seen.add(inc);
        caps.push(...menuString(rom, inc, seen, out, depth + 1));
      }
    }
    if (c === 0x0c) caps.push(byteAt(rom, a));
    a += MENU_STRING_OPERANDS.get(c) as number;
  }
  const label = `$${(0xc0 + (start >> 16)).toString(16).toUpperCase().padStart(2, '0')}:${(start & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;
  out.push([`menu string (${label}, C2/EF7E)`, start, a + 1]);
  return caps;
};

/** rom_closure.window_program: C2/ED31's program from `a` until a byte with bit 7 (the end, read). */
const windowProgram = (rom: Uint8Array, start: number): number => {
  let a = start;
  while ((byteAt(rom, a) & 0x80) === 0) a += 1 + byteAt(rom, FF + 0xbd18 + byteAt(rom, a)) + 1;
  return a + 1;
};

/** rom_closure.until0: past the next 00 byte. */
const until0 = (rom: Uint8Array, start: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1;
  return a + 1;
};

/** rom_closure.hdma_runs: an HDMA-style table read as [n, `width` bytes] entries until n = 0 (that byte read too). */
const hdmaRuns = (rom: Uint8Array, start: number, width: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1 + width;
  return a + 1;
};

export { hdmaRuns, menuString, until0, windowProgram, wordTable };
