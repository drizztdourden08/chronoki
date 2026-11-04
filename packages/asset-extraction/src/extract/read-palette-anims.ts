/* @layer shared-asset-extraction @kind logic */
import type { PaletteAnim } from './scene-palette.type';
import { PAL_ANIM, PAL_ADDR, PAL_COLOR } from './scene-palette.constants';
import { u16 } from './u16';
import type { Rgb } from './snes-color';
import { snes15ToRgb } from './snes-color';

const readColorAnim = (rom: Uint8Array, start: number, idb: number, cc: number): [number[], Rgb[], number] => {
  const addr = u16(rom, start) - 0x7380;
  let p = start + 3;
  const fc = (idb & 0x0f) + 1;
  let frames: number[] = [];
  if ((idb & 0xf0) === 0x80) {
    for (let i = 0; i < fc; i += 1) frames.push(rom[p + i] as number);
    p += fc;
  } else {
    frames = Array.from({ length: fc }, (_, i) => i);
  }
  const total = (Math.max(...frames) + 1) * cc;
  const cp = PAL_COLOR + addr;
  const colors: Rgb[] = [];
  for (let i = 0; i < total; i += 1) colors.push(snes15ToRgb(u16(rom, cp + i * 2)));
  return [frames, colors, p];
};

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
    if (![0x80, 0x30, 0x20, 0x10].includes(typ)) continue;
    const ci = rom[p] as number;
    const cc = rom[p + 1] as number;
    const delay = rom[p + 2] as number;
    p += 3;
    let frames: number[] = [];
    let colors: Rgb[] = [];
    if (typ === 0x80 || typ === 0x10) [frames, colors, p] = readColorAnim(rom, p, idb, cc);
    anims.push([typ, ci, cc, delay, frames, colors]);
  }
  return anims;
};

export { readPaletteAnims };
