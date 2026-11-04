/* @layer shared-asset-extraction @kind logic */
import type { Span } from './vm-walk.type';
import { handlerLengths } from './handler-lengths';
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { signed } from './signed-byte';

const C2 = 0x020000;

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

export { animvmWalk };
