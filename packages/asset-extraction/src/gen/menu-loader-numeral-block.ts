/* @layer shared-asset-extraction @kind logic */
import { NUMT, NUMERAL_DOC } from './menu-loader-art.constants';
import { pixelRows } from './menu-loader-pixel-rows';
import { rgb2 } from './menu-loader-rgb2';

const numeralBlock = (vram: Uint8Array, cg: Uint8Array): string => {
  let s = NUMERAL_DOC;
  NUMT.forEach((tl, k) => {
    s += `  { /* slot ${k + 1} */\n`;
    const px = Array.from({ length: 16 }, () => new Array<number>(16).fill(0));
    tl.forEach((tn, t) => {
      const ox = (t % 2) * 8;
      const oy = (t >> 1) * 8;
      const base = (0x7000 + tn * 8) * 2;
      for (let r = 0; r < 8; r += 1) {
        const p0 = vram[base + r * 2] as number;
        const p1 = vram[base + r * 2 + 1] as number;
        for (let x = 0; x < 8; x += 1) (px[oy + r] as number[])[ox + x] = ((p0 >> (7 - x)) & 1) | (((p1 >> (7 - x)) & 1) << 1);
      }
    });
    s += pixelRows(px, (v) => rgb2(cg, 4, v));
    s += '  },\n';
  });
  return `${s}};\n\n`;
};

export { numeralBlock };
