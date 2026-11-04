/* @layer shared-asset-extraction @kind logic */
import type { PeekDump } from '../oracle/peek.type';
import { rgbOfFb } from './shared/fb-decode';
import { STRIP_Y0, STRIP_H, OVERSCAN } from './battle-hud-strip.constants';
import type { Rgb3 } from './battle-hud-strip.type';

const bakeBg1 = (iso: PeekDump): Rgb3[][] => {
  const rgb = rgbOfFb(iso.fb);
  const rows: Rgb3[][] = [];
  for (let ry = 0; ry < STRIP_H; ry += 1) {
    const row: Rgb3[] = [];
    for (let x = 0; x < 256; x += 1) {
      const o = ((STRIP_Y0 + ry + OVERSCAN) * 256 + x) * 3;
      row.push([rgb[o] as number, rgb[o + 1] as number, rgb[o + 2] as number]);
    }
    rows.push(row);
  }
  return rows;
};
export { bakeBg1 };
