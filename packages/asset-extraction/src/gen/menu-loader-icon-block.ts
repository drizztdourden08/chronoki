/* @layer shared-asset-extraction @kind logic */
import { ICON_BASE, ICON_PAL, ICON_DOC } from './menu-loader-art.constants';
import type { Rgb } from './menu-loader-art.type';
import { pixelRows } from './menu-loader-pixel-rows';
import { rgbOf } from './menu-loader-rgb-of';

const iconPixels = (rom: Uint8Array, cid: number): number[][] => {
  const px = Array.from({ length: 16 }, () => new Array<number>(16).fill(0));
  for (let t = 0; t < 4; t += 1) {
    const b = ICON_BASE + cid * 0x80 + t * 32;
    const ox = (t % 2) * 8;
    const oy = (t >> 1) * 8;
    for (let r = 0; r < 8; r += 1) {
      const p0 = rom[b + r * 2] as number;
      const p1 = rom[b + r * 2 + 1] as number;
      const p2 = rom[b + 16 + r * 2] as number;
      const p3 = rom[b + 16 + r * 2 + 1] as number;
      for (let x = 0; x < 8; x += 1) {
        const bit = 7 - x;
        (px[oy + r] as number[])[ox + x] =
          ((p0 >> bit) & 1) | (((p1 >> bit) & 1) << 1) | (((p2 >> bit) & 1) << 2) | (((p3 >> bit) & 1) << 3);
      }
    }
  }
  return px;
};

const iconBlock = (rom: Uint8Array): string => {
  let s = ICON_DOC;
  for (let cid = 0; cid < 7; cid += 1) {
    s += `  { /* charId ${cid} */\n`;
    const ipal = Array.from({ length: 16 }, (_, i) => {
      const o = ICON_PAL + cid * 0x20 + i * 2;
      return rgbOf((rom[o] as number) | ((rom[o + 1] as number) << 8));
    });
    s += pixelRows(iconPixels(rom, cid), (v) => ipal[v] as Rgb);
    s += '  },\n';
  }
  return `${s}};\n\n`;
};

export { iconBlock };
