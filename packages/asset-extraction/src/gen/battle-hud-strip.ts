/* @layer shared-asset-extraction @kind logic */
import type { PeekDump } from '../oracle/peek.type';
import { rgbOfFb } from './shared/fb-decode';

type Rgb3 = [number, number, number];

const STRIP_Y0 = 160;
const STRIP_H = 48;
const OVERSCAN = 8;

/** The full-strip BG1 chrome layer: every pixel (256 cols x 48 rows) of a BG1-only render (PEEK_ISOBG=0). */
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

export type { Rgb3 };
export { bakeBg1, OVERSCAN, STRIP_H, STRIP_Y0 };
