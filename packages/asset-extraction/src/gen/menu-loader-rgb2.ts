/* @layer shared-asset-extraction @kind logic */
import type { Rgb } from './menu-loader-art.type';
import { rgbOf } from './menu-loader-rgb-of';

const rgb2 = (cg: Uint8Array, prow: number, idx: number): Rgb => {
  const o = (prow * 4 + idx) * 2;
  return rgbOf((cg[o] as number) | ((cg[o + 1] as number) << 8));
};

export { rgb2 };
