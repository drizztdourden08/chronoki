/* @layer shared-asset-extraction @kind logic */
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';
import { u16 } from './u16';

const readSpritePalette = (rom: Uint8Array, palPtrs: number[], paletteIndex: number): Rgb[] => {
  const off = palPtrs[paletteIndex] as number;
  const cols: Rgb[] = [[0, 0, 0]];
  for (let i = 0; i < 12; i += 1) cols.push(snes15ToRgb(u16(rom, off + i * 2)));
  for (let i = 0; i < 3; i += 1) cols.push([0, 0, 0]);
  return cols;
};

export { readSpritePalette };
