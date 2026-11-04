/* @layer shared-asset-extraction @kind logic @source Python maps.scene_palette, maps.read_palette_anims */
import { SCENE_PAL } from './asset-types.constants';
import { u16 } from './u16';
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';

const scenePalette = (rom: Uint8Array, pi: number): Rgb[] => {
  let p = SCENE_PAL + pi * 210;
  const cols: Rgb[] = [];
  for (let i = 0; i < 16; i += 1) cols.push([0, 0, 0]);
  for (let row = 0; row < 7; row += 1) {
    cols.push([0, 0, 0]);
    for (let i = 0; i < 15; i += 1) {
      cols.push(snes15ToRgb(u16(rom, p)));
      p += 2;
    }
  }
  return cols;
};

export { scenePalette };
export type { PaletteAnim };
