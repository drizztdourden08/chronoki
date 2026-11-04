/* @layer shared-asset-extraction @kind logic */
import { getEntries2Byte, u16 } from './rom-read';
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';

const PTR_TABLE = 0x24ffe0;

/** sprites.parse_tables, the palette pointers part: 253 local pointers from the table at ptrs[4]. */
const spritePalettePtrs = (rom: Uint8Array): number[] => {
  const ptrs = getEntries2Byte(rom, PTR_TABLE, 7);
  return getEntries2Byte(rom, ptrs[4]!, 253);
};

/** sprites.read_sprite_palette: 12 ROM colors at indices 1..12, 0 transparent, 13..15 unused. */
const readSpritePalette = (rom: Uint8Array, palPtrs: number[], paletteIndex: number): Rgb[] => {
  const off = palPtrs[paletteIndex]!;
  const cols: Rgb[] = [[0, 0, 0]];
  for (let i = 0; i < 12; i += 1) cols.push(snes15ToRgb(u16(rom, off + i * 2)));
  for (let i = 0; i < 3; i += 1) cols.push([0, 0, 0]);
  return cols;
};

export { readSpritePalette, spritePalettePtrs };
