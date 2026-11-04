/* @layer shared-asset-extraction @kind logic @source Python rom_closure._handler_lengths */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { operandLength } from './cpu65816';
import { OPCODE_TABLE } from './cpu65816.constants';
import type { Cursor, HandlerLength, Seen, Walk, WalkCtx } from './handler-lengths.type';

const C2 = 0x020000;

const bankBase = (p: number): number => Math.floor(p / 0x10000) * 0x10000;

const readOperand = (rom: Uint8Array, p: number, ln: number): number => {
  let v = 0;
  for (let k = 0; k < ln; k += 1) v += (rom[p + 1 + k] ?? 0) * 2 ** (8 * k);
  return v;
};

const applyFlagOps = (cur: Cursor, op: number, v: number): void => {
  if (op !== 0xc2 && op !== 0xe2) return;
  const val = op === 0xc2 ? 0 : 1;
  if (v & 0x20) cur.m = val;
  if (v & 0x10) cur.x = val;
};

const trackLdy = (cur: Cursor, mnem: string, mode: string, v: number): void => {
  if (mnem === 'LDY' && mode === 'immX') cur.ldy = v;
  else if (mnem === 'INY' && cur.ldy !== null) cur.ldy += 1;
};

const onReturn = (ctx: WalkCtx, cur: Cursor): void => {
  const { prev } = cur;
  const q = prev.filter((e) => e[0] !== 'CLC');
  const last = q[q.length - 1];
  if (last?.[0] === 'LDA' && last[1] === 'immM') ctx.rets.push(last[2]);
  const n = prev.length;
  if (n >= 2 && (prev[n - 1] as Seen)[0] === 'CLC') {
    const e = prev[n - 2] as Seen;
    if (e[0] === 'ORA' && e[1] === 'immM' && e[2] === 0xff00) ctx.rel = cur.ldy;
  }
};

const isHalt = (mnem: string): boolean => mnem === 'RTL' || mnem === 'RTI' || mnem === 'BRK' || mnem === 'STP';

const nextPc = (ctx: WalkCtx, cur: Cursor, decoded: { mnem: string; mode: string; v: number; ln: number }): number => {
  const { mnem, mode, v, ln } = decoded;
  const nxt = cur.p + 1 + ln;
  if (mode === 'rel') {
    const tgt = bankBase(cur.p) | ((nxt + (v >= 0x80 ? v - 256 : v)) & 0xffff);
    if (mnem === 'BRA') return tgt;
    ctx.work.push([tgt, cur.m, cur.x, cur.ldy, []]);
    return nxt;
  }
  if (mnem === 'JMP' && mode === 'abs') return bankBase(cur.p) | v;
  return nxt;
};

const stepOne = (ctx: WalkCtx, cur: Cursor): boolean => {
  const op = byteAt(ctx.rom, cur.p);
  const [mnem, mode] = OPCODE_TABLE[op] as [string, string];
  const ln = operandLength(mode, cur.m, cur.x);
  const v = readOperand(ctx.rom, cur.p, ln);
  applyFlagOps(cur, op, v);
  trackLdy(cur, mnem, mode, v);
  if (mnem === 'RTS') {
    onReturn(ctx, cur);
    return false;
  }
  if (isHalt(mnem)) return false;
  cur.prev = [...cur.prev, [mnem, mode, v] as Seen].slice(-3);
  cur.p = nextPc(ctx, cur, { mnem, mode, v, ln });
  return true;
};

const followHandler = (rom: Uint8Array, start: number): HandlerLength => {
  const ctx: WalkCtx = { rom, seen: new Set<string>(), work: [[start, 0, 0, null, []]], rets: [], rel: null };
  while (ctx.work.length > 0) {
    const [p, m, x, ldy, prev] = ctx.work.pop() as Walk;
    const cur: Cursor = { p, m, x, ldy, prev };
    while (!ctx.seen.has(`${cur.p}:${cur.m}:${cur.x}`) && ctx.seen.size < 4096) {
      ctx.seen.add(`${cur.p}:${cur.m}:${cur.x}`);
      if (!stepOne(ctx, cur)) break;
    }
  }
  return [ctx.rets.length > 0 ? Math.max(...ctx.rets) : 0, ctx.rel];
};

const cache = new WeakMap<Uint8Array, Map<string, Map<number, HandlerLength>>>();

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
