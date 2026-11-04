/* @layer shared-asset-extraction @kind logic */
import { itemAt } from './bytes/item-at';
import { wordAt } from './bytes/word-at';
import { snes15ToRgb } from './snes-color';

const readSpritePalette = (rom: Uint8Array, palPtrs: number[], paletteIndex: number): [number, number, number][] => {
  const off = itemAt(palPtrs, paletteIndex);
  const cols: [number, number, number][] = [[0, 0, 0]];
  for (let i = 0; i < 12; i += 1) cols.push(snes15ToRgb(wordAt(rom, off + i * 2)));
  return [...cols, [0, 0, 0], [0, 0, 0], [0, 0, 0]];
};

export { readSpritePalette };
