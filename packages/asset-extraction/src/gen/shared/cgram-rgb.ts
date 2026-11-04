/* @layer shared-asset-extraction @kind logic */
import type { Rgb } from './tile-decode.type';
import { x5 } from './x5';

const cgramRgb = (cg: Uint8Array, i: number): Rgb => {
  const w = (cg[i * 2] as number) | ((cg[i * 2 + 1] as number) << 8);
  return [x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)];
};

export { cgramRgb };
