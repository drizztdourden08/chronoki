/* @layer shared-asset-extraction @kind logic */
import { SCENE_PAL } from './asset-types.constants';
import { u16 } from './rom-read';
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';

const PAL_ADDR = 0x3df9c7;
const PAL_ANIM = 0x3dfa77;
const PAL_COLOR = 0x367380;

/** [type, color index, color count, delay, frames, colors] */
type PaletteAnim = [typ: number, ci: number, cc: number, delay: number, frames: number[], colors: Rgb[]];

/** maps.scene_palette: 16 black, then 7 rows of (black + 15 colors) = 128 colors. */
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

/** maps.read_palette_anims: the scene's palette-animation set (index = scene palette index). */
const readPaletteAnims = (rom: Uint8Array, index: number): PaletteAnim[] => {
  if (index * 2 + 1 >= 0xb6) return [];
  let p = PAL_ANIM + u16(rom, PAL_ADDR + index * 2);
  const end = PAL_ANIM + 0x56e;
  const anims: PaletteAnim[] = [];
  while (p < end) {
    const idb = rom[p]!;
    p += 1;
    if (idb === 0) break;
    const typ = idb & 0xf0;
    if (typ !== 0x80 && typ !== 0x30 && typ !== 0x20 && typ !== 0x10) continue;
    const ci = rom[p]!;
    const cc = rom[p + 1]!;
    const delay = rom[p + 2]!;
    p += 3;
    let frames: number[] = [];
    const colors: Rgb[] = [];
    if (typ === 0x80 || typ === 0x10) {
      const addr = u16(rom, p) - 0x7380;
      p += 3;
      const fc = (idb & 0x0f) + 1;
      if (typ === 0x80) {
        frames = [];
        for (let i = 0; i < fc; i += 1) frames.push(rom[p + i]!);
        p += fc;
      } else {
        frames = Array.from({ length: fc }, (_, i) => i);
      }
      const total = (Math.max(...frames) + 1) * cc;
      const cp = PAL_COLOR + addr;
      for (let i = 0; i < total; i += 1) colors.push(snes15ToRgb(u16(rom, cp + i * 2)));
    }
    anims.push([typ, ci, cc, delay, frames, colors]);
  }
  return anims;
};

export { readPaletteAnims, scenePalette };
export type { PaletteAnim };
