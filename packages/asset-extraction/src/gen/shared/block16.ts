/* @layer shared-asset-extraction @kind logic */
import { tile4 } from './tile4';

const block16 = (vram: Uint8Array, base: number, ...cells: [tl: number, tr: number, bl: number, br: number]): number[] => {
  const t = cells.map((n) => tile4(vram, base, n));
  const out: number[] = [];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      out.push((t[((y >> 3) << 1) + (x >> 3)] as number[])[(y % 8) * 8 + (x % 8)] as number);
    }
  }
  return out;
};

export { block16 };
