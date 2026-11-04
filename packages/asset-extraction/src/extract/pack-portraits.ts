/* @layer shared-asset-extraction @kind logic */
import { BANK_FF, T_PORTRAIT } from './asset-types.constants';
import { u16 } from './u16';
import { snes15ToRgb } from './snes-color';
import { tilePixel4 } from './tile-pixel';
import type { Packer } from './extract.type';
import type { Rgb } from './snes-color.type';

const packPortraits: Packer = ({ rom }) => {
  const B = BANK_FF;
  return Array.from({ length: 7 }, (_, c) => {
    const p = u16(rom, B + 0xce78 + c * 2);
    const pal = Array.from({ length: 16 }, (__, i) => snes15ToRgb(u16(rom, B + p + i * 2)));
    const bt = rom[B + 0xce70 + c] as number;
    const blob = new Uint8Array(2 + 48 * 48 * 3);
    blob[0] = 48;
    blob[1] = 48;
    let at = 2;
    for (let j = 0; j < 48; j += 1) {
      for (let i = 0; i < 48; i += 1) {
        const t = bt + Math.floor(j / 8) * 6 + Math.floor(i / 8);
        const [r, g, b] = pal[tilePixel4(rom, B + (t - 1) * 32, i % 8, j % 8)] as Rgb;
        blob[at] = r;
        blob[at + 1] = g;
        blob[at + 2] = b;
        at += 3;
      }
    }
    return { type: T_PORTRAIT, id: c, blob };
  });
};

export { packPortraits };
