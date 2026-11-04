/* @layer shared-asset-extraction @kind logic @source Python rom_closure.objvm_walk, rom_closure.animvm_walk */
import { byteAt } from '../bytes/byte-reader';
import { itemAt } from '../bytes/item-at';
import { handlerLengths } from './handler-lengths';
import { OBJVM_ENDS } from './vm-walk.constants';
import type { Span, Mem7f, VmCtx, VmCursor, VmDecoded, VmReader } from './vm-walk.type';
import { signed } from './signed-byte';

const makeReader = (ctx: VmCtx, { bank, pc }: VmCursor): VmReader | null => {
  const { rom, mem7f } = ctx;
  if (bank >= 0xc0) {
    const base = ((bank - 0xc0) << 16) | pc;
    return { o: base, rd: (k) => byteAt(rom, base + k) };
  }
  if (bank === 0x7f && mem7f !== null && mem7f[1][0] <= pc && pc < mem7f[1][1]) {
    return { o: null, rd: (k) => byteAt(mem7f[0], (pc + k) & 0xffff) };
  }
  return null;
};

const decodeOps = (ctx: VmCtx, reader: VmReader, op: number, entry: [number, number | null]): VmDecoded | null => {
  const { o, rd } = reader;
  let [ln] = entry;
  const rel = entry[1];
  if (OBJVM_ENDS.has(op) || ln === 0) {
    if (o !== null) ctx.spans.push([o, o + 1]);
    return null;
  }
  if (op === 0x1a || op === 0x36) ln = 3;
  const ops = Array.from({ length: ln }, (_, k) => rd(k));
  if (o !== null) ctx.spans.push([o, o + ln]);
  return { ln, rel, ops };
};

const operandOf = (ops: number[]): number => itemAt(ops, 1) | (itemAt(ops, 2) << 8);

const queueTargets = (ctx: VmCtx, bank: number, op: number, ops: number[]): void => {
  if (op === 0x36) {
    ctx.work.push([bank, operandOf(ops)]);
  } else if (op === 0x09 || op === 0x43) {
    ctx.work.push([itemAt(ops, 3), operandOf(ops)]);
  } else if ((op === 0x03 || op === 0x04) && itemAt(ops, 3) >= 0xc0) {
    const s = ((itemAt(ops, 3) - 0xc0) << 16) | operandOf(ops);
    ctx.data.push([s, s + (op === 0x03 ? 32 * (itemAt(ops, 8) | (itemAt(ops, 9) << 8)) : 32)]);
  }
};

const follow = (ctx: VmCtx, cur: VmCursor, op: number, dec: VmDecoded): void => {
  const { ln, rel, ops } = dec;
  if (op === 0x1a) {
    cur.pc = (operandOf(ops) + 1) & 0xffff;
    return;
  }
  queueTargets(ctx, cur.bank, op, ops);
  if (rel !== null) ctx.work.push([cur.bank, (cur.pc + signed(itemAt(ops, ln - 1))) & 0xffff]);
  cur.pc = (cur.pc + ln) & 0xffff;
};

const stepVm = (ctx: VmCtx, cur: VmCursor): boolean => {
  const reader = makeReader(ctx, cur);
  if (reader === null) return false;
  ctx.seen.add(`${cur.bank}:${cur.pc}`);
  const op = reader.rd(0);
  const entry = ctx.lens.get(op);
  if (!entry) return false;
  const dec = decodeOps(ctx, reader, op, entry);
  if (dec === null) return false;
  follow(ctx, cur, op, dec);
  return true;
};

const objvmWalk = (rom: Uint8Array, entries: [number, number][], mem7f: Mem7f | null = null): [Span[], Span[]] => {
  const ctx: VmCtx = {
    rom,
    mem7f,
    lens: handlerLengths(rom, 0x0f91, 0x53),
    seen: new Set<string>(),
    spans: [],
    data: [],
    work: [...entries],
  };
  while (ctx.work.length > 0) {
    const [bank, pc] = ctx.work.pop() as [number, number];
    const cur: VmCursor = { bank, pc };
    while (!ctx.seen.has(`${cur.bank}:${cur.pc}`)) {
      if (!stepVm(ctx, cur)) break;
    }
  }
  return [ctx.spans, ctx.data];
};

export { objvmWalk };
export type { Mem7f, Span };
