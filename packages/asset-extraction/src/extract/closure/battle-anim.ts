/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.anim_walk, rom_closure_battle.anim_script, rom_closure_battle.anim_tables */
import { byteAt } from '../bytes/byte-reader';
import { itemAt } from '../bytes/item-at';
import { wordAt } from '../bytes/word-at';
import { byteSpans } from './byte-spans';
import { romLabel } from './rom-label';
import type { RomTable } from './closure.type';
import { C1, CE, ANIM_OP_JT, ANIM_OPS, ANIM_TABLES } from './battle-anim.constants';
import type { WalkSpan, WalkState } from './battle-anim.type';
import { animHandler } from './anim-handler';

const popcount = (v: number): number => v.toString(2).replace(/0/g, '').length;

const isWalkStop = (h: number, op: number): boolean => h === 0x4cf0 || h === 0x4cf7 || op === 0x1f;

const opLength = (rom: Uint8Array, q: number, op: number, lens: number[]): number =>
  op === 0x80 ? 1 + (byteAt(rom, q + 1) & 0x0f) : itemAt(lens, op);

const animWalk = (rom: Uint8Array, st: WalkState, span: WalkSpan): void => {
  const { start, bankEnd, depth } = span;
  let q = start;
  for (let i = 0; i < 512; i += 1) {
    if (q >= bankEnd) return;
    const op = byteAt(rom, q);
    st.seen.add(q);
    if (isWalkStop(animHandler(rom, op), op)) return;
    const n = opLength(rom, q, op, st.lens);
    if (n <= 0) return;
    for (let k = q; k < q + n; k += 1) st.seen.add(k);
    if (op === 0x1e && depth < 3) {
      const ss = byteAt(rom, q + 1);
      st.supers.add(ss);
      const tb = CE + 2 * ss;
      st.seen.add(tb);
      st.seen.add(tb + 1);
      animWalk(rom, st, { start: CE | wordAt(rom, tb), bankEnd: CE + 0x10000, depth: depth + 1 });
    }
    q += n;
  }
};

const animScript = (rom: Uint8Array, hdr: number, bank: number, st: WalkState): void => {
  const m1 = (byteAt(rom, hdr) << 8) | byteAt(rom, hdr + 1);
  const m2 = (byteAt(rom, hdr + 2) << 8) | byteAt(rom, hdr + 3);
  const n = popcount(m1) + popcount(m2);
  for (let k = hdr; k < hdr + 4 + 2 * n; k += 1) st.seen.add(k);
  for (let k = 0; k < n; k += 1) animWalk(rom, st, { start: bank | wordAt(rom, hdr + 4 + 2 * k), bankEnd: bank + 0x10000, depth: 0 });
};

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

export { animTables };
