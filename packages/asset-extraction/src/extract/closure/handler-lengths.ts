/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../bytes/byte-reader';
import { OPCODE_TABLE, operandLength } from './cpu65816';

const C2 = 0x020000;

/** [bytes the handler advances, the operand index of its branch displacement or null]. */
type HandlerLength = [number, number | null];
type Seen = [string, string, number];
/** [pc, M flag, X flag, LDY value, the last three instructions]. */
type Walk = [number, number, number, number | null, Seen[]];

const bankBase = (p: number): number => Math.floor(p / 0x10000) * 0x10000;

/** Follows one handler through its branches; returns its largest `LDA #n / [CLC] / RTS` and the displacement operand index. */
const followHandler = (rom: Uint8Array, start: number): HandlerLength => {
  const rets: number[] = [];
  let rel: number | null = null;
  const seen = new Set<string>();
  const work: Walk[] = [[start, 0, 0, null, []]];
  while (work.length > 0) {
    let [p, m, x, ldy, prev] = work.pop() as Walk;
    while (!seen.has(`${p}:${m}:${x}`) && seen.size < 4096) {
      seen.add(`${p}:${m}:${x}`);
      const op = byteAt(rom, p);
      const [mnem, mode] = OPCODE_TABLE[op] as [string, string];
      const ln = operandLength(mode, m, x);
      let v = 0;
      for (let k = 0; k < ln; k += 1) v += (rom[p + 1 + k] ?? 0) * 2 ** (8 * k);
      if (op === 0xc2) {
        m = v & 0x20 ? 0 : m;
        x = v & 0x10 ? 0 : x;
      } else if (op === 0xe2) {
        m = v & 0x20 ? 1 : m;
        x = v & 0x10 ? 1 : x;
      }
      if (mnem === 'LDY' && mode === 'immX') ldy = v;
      else if (mnem === 'INY' && ldy !== null) ldy += 1;
      if (mnem === 'RTS') {
        const q = prev.filter((e) => e[0] !== 'CLC');
        const last = q[q.length - 1];
        if (last && last[0] === 'LDA' && last[1] === 'immM') rets.push(last[2]);
        const n = prev.length;
        if (n >= 2 && (prev[n - 1] as Seen)[0] === 'CLC') {
          const e = prev[n - 2] as Seen;
          if (e[0] === 'ORA' && e[1] === 'immM' && e[2] === 0xff00) rel = ldy;
        }
        break;
      }
      if (mnem === 'RTL' || mnem === 'RTI' || mnem === 'BRK' || mnem === 'STP') break;
      prev = [...prev, [mnem, mode, v] as Seen].slice(-3);
      const nxt = p + 1 + ln;
      if (mode === 'rel') {
        const tgt = bankBase(p) | ((nxt + (v >= 0x80 ? v - 256 : v)) & 0xffff);
        if (mnem === 'BRA') {
          p = tgt;
          continue;
        }
        work.push([tgt, m, x, ldy, []]);
      } else if (mnem === 'JMP' && mode === 'abs') {
        p = bankBase(p) | v;
        continue;
      }
      p = nxt;
    }
  }
  return [rets.length > 0 ? Math.max(...rets) : 0, rel];
};

const cache = new WeakMap<Uint8Array, Map<string, Map<number, HandlerLength>>>();

/** rom_closure._handler_lengths: {op: [length, rel]} of a bank-C2 dispatcher's handlers (`JSR (table,X)`, the returned A = bytes to advance). */
const handlerLengths = (rom: Uint8Array, table: number, count: number): Map<number, HandlerLength> => {
  const perRom = cache.get(rom) ?? new Map<string, Map<number, HandlerLength>>();
  cache.set(rom, perRom);
  const key = `${table}:${count}`;
  const hit = perRom.get(key);
  if (hit) return hit;
  const res = new Map<number, HandlerLength>();
  for (let i = 0; i < count; i += 1) res.set(i, followHandler(rom, C2 + wordAt(rom, C2 + table + 2 * i)));
  perRom.set(key, res);
  return res;
};

export { handlerLengths };
export type { HandlerLength };
