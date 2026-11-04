/* @layer shared-asset-extraction @kind logic */
import { BANK_FF, T_NAMESPRITES } from './asset-types.constants';
import { u16 } from './u16';
import { snes15ToRgb } from './snes-color';
import { tilePixel4 } from './tile-pixel';
import type { Packer } from './extract.type';

const spriteCrop = (rom: Uint8Array, pal: number[][], gfx: number, cx: number, cy: number, w: number, h: number): Uint8Array => {
  const out = new Uint8Array(2 + w * h * 4);
  out[0] = w;
  out[1] = h;
  let at = 2;
  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) {
      const X = cx + i;
      const Y = cy + j;
      const sub = Math.floor(Y / 8) * 2 + Math.floor(X / 8);
      out.set(pal[tilePixel4(rom, BANK_FF + gfx + sub * 32, X % 8, Y % 8)]!, at);
      at += 4;
    }
  }
  return out;
};

const packNamesprites: Packer = ({ rom }) => {
  const pal = Array.from({ length: 16 }, (_, i) => [...snes15ToRgb(u16(rom, BANK_FF + 0x9df0 + i * 2)), i === 0 ? 0 : 255]);
  return [
    { type: T_NAMESPRITES, id: 0, blob: spriteCrop(rom, pal, 0x9cf0, 0, 0, 16, 16) },
    { type: T_NAMESPRITES, id: 1, blob: spriteCrop(rom, pal, 0x9d70, 2, 1, 11, 12) },
  ];
};

export { packNamesprites };
