/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';
import { GLB, LOC } from './script-mem.constants';
import type { OpHandler, RunCtx } from './script-run.type';
import { MASKS, ARITH } from './script-ops-data.constants';

const b = (c: RunCtx, addr: number, k: number): number => byteAt(c.body, addr + k);
const w = (c: RunCtx, addr: number, k: number): number => b(c, addr, k) | (b(c, addr, k + 1) << 8);

const flat24 = (bank: number, off: number): number | null => {
  if (bank === 0x7e) return 0x7e0000 + off;
  if (bank === 0x7f) return 0x7f0000 + off;
  if ((bank <= 0x3f || (bank >= 0x80 && bank <= 0xbf)) && off < 0x2000) return 0x7e0000 + off;
  return null;
};

const localOperands = (c: RunCtx, op: number, addr: number): [number, number] => {
  const o1 = b(c, addr, 1);
  if (op === 0x60) return [o1 | (b(c, addr, 2) << 8), b(c, addr, 3)];
  if (op === 0x5e || op === 0x61) return [c.mem.r16(LOC + o1 * 2), b(c, addr, 2)];
  if (op === 0x63 || op === 0x64) {
    const k = (op === 0x64 ? 8 : 0) + o1;
    return [k < 16 ? (MASKS[k] as number) : 0, b(c, addr, 2)];
  }
  return [o1, b(c, addr, 2)];
};

const shiftRight = (cur: number, src: number): number => {
  let res = cur;
  let n = src;
  do {
    res = (res & 0xff) >> 1;
    n = (n - 1) & 0xff;
  } while (n !== 0);
  return res;
};

const localCompute = (op: number, cur: number, src: number): number => {
  if (op === 0x5b || op === 0x5e) return cur + src;
  if (op === 0x5f || op === 0x60 || op === 0x61) return cur - src;
  if (op === 0x63 || op === 0x69) return cur | src;
  if (op === 0x64 || op === 0x67) return cur & src;
  if (op === 0x6b) return cur ^ src;
  return shiftRight(cur, src);
};

const localArith = (c: RunCtx, op: number, addr: number): void => {
  const [src, di] = localOperands(c, op, addr);
  const a = LOC + di * 2;
  const wide = op === 0x5e || op === 0x60;
  const cur = wide ? c.mem.r16(a) : c.mem.r8(a);
  const res = localCompute(op, cur, src);
  if (wide) c.mem.w16(a, res & 0xffff);
  else c.mem.w8(a, res);
};

const readPointer =
  (is16: boolean): OpHandler =>
  (c, addr, nxt) => {
    const bank = b(c, addr, 3);
    const off = w(c, addr, 1);
    const d = LOC + b(c, addr, 4) * 2;
    const fa = flat24(bank, off);
    if (fa !== null) {
      c.mem.w8(d, c.mem.r8(fa));
      if (is16) {
        const fb = flat24(bank, (off + 1) & 0xffff);
        c.mem.w8(d + 1, fb !== null ? c.mem.r8(fb) : 0);
      }
    }
    return nxt;
  };

const setBit =
  (on: boolean): OpHandler =>
  (c, addr, nxt) => {
    const bit = b(c, addr, 1);
    let li = b(c, addr, 2);
    if (bit & 0x80) li += 0x100;
    const cur = c.mem.r8(GLB + li);
    c.mem.w8(GLB + li, on ? cur | (1 << (bit & 7)) : cur & ~(1 << (bit & 7)));
    return nxt;
  };

const store =
  (f: (c: RunCtx, addr: number) => void): OpHandler =>
  (c, addr, nxt) => {
    f(c, addr);
    return nxt;
  };

const counter = (delta: number): OpHandler =>
  store((c, addr) => {
    const i = LOC + b(c, addr, 1) * 2;
    c.mem.w8(i, c.mem.r8(i) + delta);
  });

const dataOps: [number, OpHandler][] = [
  [0x4f, store((c, a) => c.mem.w8(LOC + b(c, a, 2) * 2, b(c, a, 1)))],
  [0x50, store((c, a) => c.mem.w16(LOC + b(c, a, 3) * 2, w(c, a, 1)))],
  [0x75, store((c, a) => c.mem.w8(LOC + b(c, a, 1) * 2, 1))],
  [0x77, store((c, a) => c.mem.w8(LOC + b(c, a, 1) * 2, 0))],
  [0x55, store((c, a) => c.mem.w8(LOC + b(c, a, 1) * 2, c.mem.r8(GLB)))],
  [0x51, store((c, a) => c.mem.w8(LOC + b(c, a, 2) * 2, c.mem.r8(LOC + b(c, a, 1) * 2)))],
  [0x52, store((c, a) => c.mem.w16(LOC + b(c, a, 2) * 2, c.mem.r16(LOC + b(c, a, 1) * 2)))],
  [0x54, store((c, a) => c.mem.w16(LOC + b(c, a, 3) * 2, c.mem.r16(GLB + w(c, a, 1))))],
  [0x59, store((c, a) => c.mem.w16(GLB + w(c, a, 2), c.mem.r16(LOC + b(c, a, 1) * 2)))],
  [0x53, store((c, a) => c.mem.w8(LOC + b(c, a, 3) * 2, c.mem.r8(GLB + w(c, a, 1))))],
  [0x56, store((c, a) => c.mem.w8(GLB + w(c, a, 2), b(c, a, 1)))],
  [0x58, store((c, a) => c.mem.w8(GLB + w(c, a, 2), c.mem.r8(LOC + b(c, a, 1) * 2)))],
  [0x5a, store((c, a) => c.mem.w8(GLB, b(c, a, 1)))],
  [0x48, readPointer(false)],
  [0x49, readPointer(true)],
  ...ARITH.map((op): [number, OpHandler] => [op, store((c, a) => localArith(c, op, a))]),
  [0x71, counter(1)],
  [0x73, counter(-1)],
  [0x65, setBit(true)],
  [0x66, setBit(false)],
];

export { dataOps };
