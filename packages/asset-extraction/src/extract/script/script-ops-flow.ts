/* @layer shared-asset-extraction @kind logic @source Python script._cmp */
import { byteAt } from '../bytes/byte-reader';
import { GLB, LOC } from './script-mem';
import type { OpHandler } from './script-run.type';

const cmp = (l: number, r: number, code: number): boolean =>
  [l === r, l !== r, l > r, l < r, l >= r, l <= r, (l & r) > 0, (l | r) > 0][code & 7] as boolean;

const jumpIf =
  (test: (c: Parameters<OpHandler>[0], addr: number) => boolean, at: number): OpHandler =>
  (c, addr, nxt) =>
    test(c, addr) ? nxt : addr + byteAt(c.body, addr + at) + at;

const b = (c: Parameters<OpHandler>[0], addr: number, k: number): number => byteAt(c.body, addr + k);

const FLOW_OPS: [number, OpHandler][] = [
  [0x10, (c, addr) => addr + b(c, addr, 1) + 1],
  [0x11, (c, addr) => addr - b(c, addr, 1) + 1],
  [0x12, jumpIf((c, a) => cmp(c.mem.r8(LOC + b(c, a, 1) * 2), b(c, a, 2), b(c, a, 3)), 4)],
  [0x13, jumpIf((c, a) => cmp(c.mem.r16(LOC + b(c, a, 1) * 2), b(c, a, 2) | (b(c, a, 3) << 8), b(c, a, 4)), 5)],
  [0x14, jumpIf((c, a) => cmp(c.mem.r8(LOC + b(c, a, 1) * 2), c.mem.r8(LOC + b(c, a, 2) * 2), b(c, a, 3)), 4)],
  [0x15, jumpIf((c, a) => cmp(c.mem.r16(LOC + b(c, a, 1) * 2), c.mem.r16(LOC + b(c, a, 2) * 2), b(c, a, 3)), 4)],
  [
    0x16,
    jumpIf((c, a) => {
      let li = b(c, a, 1);
      const rhs = b(c, a, 2);
      const cb = b(c, a, 3);
      if (cb & 0x80) li += 0x100;
      return cmp(c.mem.r8(GLB + li), rhs, cb & 0x7f);
    }, 4),
  ],
  [0x18, jumpIf((c, a) => c.mem.r8(GLB) < b(c, a, 1), 2)],
  [0x1a, jumpIf((c, a) => b(c, a, 1) === 0, 2)],
  [
    0xd2,
    (c, addr, nxt) => {
      const pc = b(c, addr, 1);
      for (let k = 0; k < 3; k += 1) if (c.mem.r8(0x7e2980 + k) === pc) return nxt;
      return addr + 2 + b(c, addr, 2);
    },
  ],
  [
    0xcf,
    (c, addr, nxt) => {
      const id = b(c, addr, 1);
      for (let k = 0; k < 9; k += 1) if (c.mem.r8(0x7e2980 + k) === id) return nxt;
      return addr + 2 + b(c, addr, 2);
    },
  ],
  [
    0xc9,
    (c, addr, nxt) => {
      const it = b(c, addr, 1);
      if (it !== 0) for (let k = 0; k < 0x100; k += 1) if (c.mem.s[0x2400 + k] === it) return nxt;
      return addr + 2 + b(c, addr, 2);
    },
  ],
];

export { FLOW_OPS };
