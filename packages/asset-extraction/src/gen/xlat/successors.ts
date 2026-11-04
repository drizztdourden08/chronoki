/* @layer shared-asset-extraction @kind logic */
import type { Site } from './xlat-site.type';
import { BRANCH, ENDS } from './xlat-static.constants';
import type { Successors } from './xlat-static.type';

const widthFlags = (op: number, flags: number, m: number, x: number): [number, number] => {
  if (op !== 0xc2 && op !== 0xe2) return [m, x];
  const value = op === 0xc2 ? 0 : 1;
  return [flags & 0x20 ? value : m, flags & 0x10 ? value : x];
};

const targetsOf = (op: number, b: number[], k: number, pc: number): number[] => {
  const at = (i: number): number => b[i] as number;
  const bank = k << 16;
  if (BRANCH.has(op) || op === 0x80) {
    const rel = at(1) >= 0x80 ? at(1) - 256 : at(1);
    return [bank | ((pc + 2 + rel) & 0xffff)];
  }
  if (op === 0x82) {
    let rel = at(1) | (at(2) << 8);
    if (rel >= 0x8000) rel -= 0x10000;
    return [bank | ((pc + 3 + rel) & 0xffff)];
  }
  if (op === 0x20 || op === 0x4c) return [bank | at(1) | (at(2) << 8)];
  if (op === 0x22 || op === 0x5c) return [at(1) | (at(2) << 8) | (at(3) << 16)];
  return [];
};

const successors = (adr: number, s: Site): Successors => {
  const { op, bytes: b, len } = s;
  const k = adr >> 16;
  const pc = adr & 0xffff;
  const [m, x] = widthFlags(op, b[1] as number, s.m, s.x);
  const next = (k << 16) | ((pc + len) & 0xffff);
  return { targets: targetsOf(op, b, k, pc), falls: !ENDS.has(op), next, m, x };
};

export { successors };
