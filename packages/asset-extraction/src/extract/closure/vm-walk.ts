/* @layer shared-asset-extraction @kind logic */
import { byteAt, itemAt, wordAt } from '../bytes/byte-reader';
import { handlerLengths } from './handler-lengths';

const C2 = 0x020000;
/** The object VM's end ops: 06 and 41 return 0 for ever, 37 returns, 52 frees the block. */
const OBJVM_ENDS = new Set([0x06, 0x37, 0x41, 0x52]);

type Span = [number, number];
/** A $7F script image: (64 KB image, [lo, hi) the packet that holds it). */
type Mem7f = [Uint8Array, [number, number]];

const signed = (r: number): number => (r >= 0x80 ? r - 256 : r);

/** rom_closure.objvm_walk: ([start, end) of the ROM script bytes, [start, end) of the ROM data ops 03 / 04 name) from `entries` [bank, pc]. */
const objvmWalk = (rom: Uint8Array, entries: [number, number][], mem7f: Mem7f | null = null): [Span[], Span[]] => {
  const L = handlerLengths(rom, 0x0f91, 0x53);
  const spans: Span[] = [];
  const data: Span[] = [];
  const seen = new Set<string>();
  const work: [number, number][] = [...entries];
  while (work.length > 0) {
    let [bank, pc] = work.pop() as [number, number];
    while (!seen.has(`${bank}:${pc}`)) {
      let o: number | null = null;
      let rd: (k: number) => number;
      if (bank >= 0xc0) {
        const base = ((bank - 0xc0) << 16) | pc;
        o = base;
        rd = (k) => byteAt(rom, base + k);
      } else if (bank === 0x7f && mem7f !== null && mem7f[1][0] <= pc && pc < mem7f[1][1]) {
        const at = pc;
        rd = (k) => byteAt(mem7f[0], (at + k) & 0xffff);
      } else {
        break;
      }
      seen.add(`${bank}:${pc}`);
      const op = rd(0);
      const entry = L.get(op);
      if (!entry) break;
      let [ln, rel] = entry;
      if (OBJVM_ENDS.has(op) || ln === 0) {
        if (o !== null) spans.push([o, o + 1]);
        break;
      }
      if (op === 0x1a || op === 0x36) ln = 3;
      const ops = Array.from({ length: ln }, (_, k) => rd(k));
      if (o !== null) spans.push([o, o + ln]);
      const operand = (): number => itemAt(ops, 1) | (itemAt(ops, 2) << 8);
      if (op === 0x1a) {
        pc = (operand() + 1) & 0xffff;
        continue;
      }
      if (op === 0x36) {
        work.push([bank, operand()]);
      } else if (op === 0x09 || op === 0x43) {
        work.push([itemAt(ops, 3), operand()]);
      } else if (op === 0x03 && itemAt(ops, 3) >= 0xc0) {
        const s = ((itemAt(ops, 3) - 0xc0) << 16) | operand();
        data.push([s, s + 32 * (itemAt(ops, 8) | (itemAt(ops, 9) << 8))]);
      } else if (op === 0x04 && itemAt(ops, 3) >= 0xc0) {
        const s = ((itemAt(ops, 3) - 0xc0) << 16) | operand();
        data.push([s, s + 32]);
      }
      if (rel !== null) work.push([bank, (pc + signed(itemAt(ops, ln - 1))) & 0xffff]);
      pc = (pc + ln) & 0xffff;
    }
  }
  return [spans, data];
};

/** rom_closure.animvm_walk: the anim sub-VM's bank-C2 scripts (table C2:0E4A, 8 ops) from `entries`: bytecode and the frames op 4 names. */
const animvmWalk = (rom: Uint8Array, entries: number[]): Span[] => {
  const L = handlerLengths(rom, 0x0e4a, 8);
  const out: Span[] = [];
  const seen = new Set<number>();
  const work = [...entries];
  while (work.length > 0) {
    let pc = work.pop() as number;
    while (!seen.has(pc)) {
      seen.add(pc);
      const o = C2 + pc;
      const op = byteAt(rom, o);
      const entry = L.get(op);
      if (!entry) break;
      const ln = entry[0];
      if (op === 3) {
        out.push([o, o + 2]);
        pc = (pc + signed(byteAt(rom, o + 1))) & 0xffff;
        continue;
      }
      if (ln === 0) {
        out.push([o, o + 1]);
        break;
      }
      out.push([o, o + ln]);
      if (op === 4) {
        const d = C2 + wordAt(rom, o + 1);
        out.push([d, d + 1 + 4 * byteAt(rom, d)]);
      }
      pc = (pc + ln) & 0xffff;
    }
  }
  return out;
};

export { animvmWalk, objvmWalk };
export type { Mem7f, Span };
