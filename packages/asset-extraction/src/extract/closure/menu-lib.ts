/* @layer shared-asset-extraction @kind logic @source Python rom_closure.word_table, rom_closure.menu_string, rom_closure.window_program, rom_closure.until0, rom_closure.hdma_runs */
import { byteAt, wordAt } from '../bytes/byte-reader';
import type { RomTable } from './closure.type';
import { FF, MENU_STRING_OPERANDS } from './menu-lib.constants';

const wordTable = (rom: Uint8Array, at: number, bank: number): [number[], number] => {
  const ts: number[] = [];
  let o = at;
  while (o < bank + Math.min(...ts, 0x10000) && o + 1 < rom.length) {
    ts.push(wordAt(rom, o));
    o += 2;
  }
  return [ts, o];
};

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

const windowProgram = (rom: Uint8Array, start: number): number => {
  let a = start;
  while ((byteAt(rom, a) & 0x80) === 0) a += 1 + byteAt(rom, FF + 0xbd18 + byteAt(rom, a)) + 1;
  return a + 1;
};

const until0 = (rom: Uint8Array, start: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1;
  return a + 1;
};

const hdmaRuns = (rom: Uint8Array, start: number, width: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1 + width;
  return a + 1;
};

export { hdmaRuns, menuString, until0, windowProgram, wordTable };
