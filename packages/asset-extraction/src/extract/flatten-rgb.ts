/* @layer shared-asset-extraction @kind logic */
import type { Rgb } from './snes-color';

const flattenRgb = (colors: Rgb[]): Uint8Array => {
  const out = new Uint8Array(colors.length * 3);
  colors.forEach(([r, g, b], i) => {
    out[i * 3] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  });
  return out;
};

export { flattenRgb };
