/* @layer shared-asset-extraction @kind logic */
import type { MapCell } from './battle-hud-bake.type';

const tmword = (vram: Uint8Array, i: number): number => {
  const o = 0x7800 * 2 + i * 2;
  return (vram[o] as number) | ((vram[o + 1] as number) << 8);
};

const bakeMap = (vram: Uint8Array): MapCell[][] => {
  const rows: MapCell[][] = [];
  for (let r = 0; r < 7; r += 1) {
    const row: MapCell[] = [];
    for (let c = 0; c < 32; c += 1) {
      const wd = tmword(vram, r * 32 + c);
      row.push([wd & 0x3ff, (wd >> 10) & 7]);
    }
    rows.push(row);
  }
  return rows;
};

export { bakeMap };
