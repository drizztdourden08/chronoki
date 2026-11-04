/* @layer shared-asset-extraction @kind logic */
import type { Rgb } from './menugfx.type';
import { cgWord } from './cg-word';
import { x5 } from './x5';

const rgb = (cg: Uint8Array, i: number): Rgb => {
  const w = cgWord(cg, i);
  return [x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)];
};

export { rgb };
