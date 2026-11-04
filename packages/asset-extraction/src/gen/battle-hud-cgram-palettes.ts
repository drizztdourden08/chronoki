/* @layer shared-asset-extraction @kind logic */
import { cgramOf } from './shared/fb-decode';
import type { Rgb3 } from './battle-hud-strip.type';

const x5 = (v: number): number => (v << 3) | (v >> 2);

const cgramPalettes = (oam: Uint8Array): Rgb3[][] => {
  const cg = cgramOf(oam);
  const pal: Rgb3[][] = [];
  for (let p = 0; p < 8; p += 1) {
    const row: Rgb3[] = [];
    for (let c = 0; c < 4; c += 1) {
      const idx = p * 4 + c;
      const w = (cg[idx * 2] as number) | ((cg[idx * 2 + 1] as number) << 8);
      row.push([x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)]);
    }
    pal.push(row);
  }
  return pal;
};

export { cgramPalettes };
