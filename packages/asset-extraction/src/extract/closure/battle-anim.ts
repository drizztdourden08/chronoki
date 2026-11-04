/* @layer shared-asset-extraction @kind logic */
import { byteAt, itemAt, wordAt } from '../bytes/byte-reader';
import { byteSpans, romLabel } from './byte-spans';
import type { RomTable } from './closure.type';

const C1 = 0x010000;
const CD = 0x0d0000;
const CE = 0x0e0000;
const ANIM_OP_JT = C1 + 0x7a6b;
const ANIM_OPS = 0xdb;

/** The dispatch tables (C1/442C .. C1/47C6), each to the next one: [table, end, script bank]. */
const ANIM_TABLES: [number, number, number][] = [
  [CD + 0x5ec6, CD + 0x5ef0, CE],
  [CD + 0x5ef0, CD + 0x5ff0, CE],
  [CD + 0x5ff0, CD + 0x61f0, CD],
  [CD + 0x61f0, CD + 0x63f0, CD],
  [CD + 0x63f0, CD + 0x656e, CE],
];

const popcount = (v: number): number => v.toString(2).replace(/0/g, '').length;
const animHandler = (rom: Uint8Array, op: number): number => (op < ANIM_OPS ? wordAt(rom, ANIM_OP_JT + 2 * op) : -1);

interface WalkState {
  lens: number[];
  seen: Set<number>;
  supers: Set<number>;
}

/** rom_closure_battle.anim_walk: one track from `start` the way battleAscTick runs it, up to a terminator or a 1F return. */
const animWalk = (rom: Uint8Array, start: number, bankEnd: number, st: WalkState, depth = 0): void => {
  let q = start;
  for (let i = 0; i < 512; i += 1) {
    if (q >= bankEnd) return;
    const op = byteAt(rom, q);
    st.seen.add(q);
    const h = animHandler(rom, op);
    if (h === 0x4cf0 || h === 0x4cf7 || op === 0x1f) return;
    const n = op === 0x80 ? 1 + (byteAt(rom, q + 1) & 0x0f) : itemAt(st.lens, op);
    if (n <= 0) return;
    for (let k = q; k < q + n; k += 1) st.seen.add(k);
    if (op === 0x1e && depth < 3) {
      const ss = byteAt(rom, q + 1);
      st.supers.add(ss);
      const tb = CE + 2 * ss;
      st.seen.add(tb);
      st.seen.add(tb + 1);
      animWalk(rom, CE | wordAt(rom, tb), CE + 0x10000, st, depth + 1);
    }
    q += n;
  }
};

/** rom_closure_battle.anim_script: a script's header (two track masks, then their pointers) and every track both masks name. */
const animScript = (rom: Uint8Array, hdr: number, bank: number, st: WalkState): void => {
  const m1 = (byteAt(rom, hdr) << 8) | byteAt(rom, hdr + 1);
  const m2 = (byteAt(rom, hdr + 2) << 8) | byteAt(rom, hdr + 3);
  const n = popcount(m1) + popcount(m2);
  for (let k = hdr; k < hdr + 4 + 2 * n; k += 1) st.seen.add(k);
  for (let k = 0; k < n; k += 1) animWalk(rom, bank | wordAt(rom, hdr + 4 + 2 * k), bank + 0x10000, st);
};

/** rom_closure_battle.anim_tables: the opcode handlers, the dispatch tables and every anim script byte they reach. `lens` = saves/anim_oplen.bin. */
const animTables = (rom: Uint8Array, lens: number[]): RomTable[] => {
  const st: WalkState = { lens, seen: new Set(), supers: new Set() };
  const out: RomTable[] = [['anim opcode handlers ($C1:7A6B, 00-DA)', ANIM_OP_JT, ANIM_OP_JT + 2 * ANIM_OPS]];
  const handlers = new Set(Array.from({ length: ANIM_OPS }, (_, op) => animHandler(rom, op)));
  for (const h of [...handlers].sort((a, b) => a - b)) {
    out.push([`anim opcode handler C1/${h.toString(16).toUpperCase().padStart(4, '0')} (its advance, read)`, C1 + h, C1 + h + 0x65]);
  }
  for (const [t0, t1, bank] of ANIM_TABLES) {
    out.push([`anim dispatch table $CD:${(t0 & 0xffff).toString(16).toUpperCase()}`, t0, t1]);
    for (let e = t0; e < t1; e += 2) animScript(rom, bank | wordAt(rom, e), bank, st);
  }
  for (const [a, b] of byteSpans(st.seen)) out.push([`anim script bytes ${romLabel(a)}`, a, b]);
  return out;
};

export { ANIM_OPS, animHandler, animTables };
