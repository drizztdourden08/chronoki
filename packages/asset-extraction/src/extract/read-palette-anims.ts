/* @layer shared-asset-extraction @kind logic */
import type { PaletteAnim } from './scene-palette.type';
import { PAL_ANIM, PAL_ADDR, PAL_COLOR } from './scene-palette.constants';
import { u16 } from './u16';
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';

const readPaletteAnims = (rom: Uint8Array, index: number): PaletteAnim[] => {
  if (index * 2 + 1 >= 0xb6) return [];
  let p = PAL_ANIM + u16(rom, PAL_ADDR + index * 2);
  const end = PAL_ANIM + 0x56e;
  const anims: PaletteAnim[] = [];
  while (p < end) {
    const idb = rom[p] as number;
    p += 1;
    if (idb === 0) break;
    const typ = idb & 0xf0;
    if (typ !== 0x80 && typ !== 0x30 && typ !== 0x20 && typ !== 0x10) continue;
    const ci = rom[p] as number;
    const cc = rom[p + 1] as number;
    const delay = rom[p + 2] as number;
    p += 3;
    let frames: number[] = [];
    const colors: Rgb[] = [];
    if (typ === 0x80 || typ === 0x10) {
      const addr = u16(rom, p) - 0x7380;
      p += 3;
      const fc = (idb & 0x0f) + 1;
      if (typ === 0x80) {
        frames = [];
        for (let i = 0; i < fc; i += 1) frames.push(rom[p + i] as number);
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

export { readPaletteAnims };
