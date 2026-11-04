/* @layer shared-asset-extraction @kind logic */
import type { PngChunks } from './png-chunks.type';

const paintRow = (px: Uint8Array, line: Uint8Array, y: number, png: PngChunks): void => {
  const { w, ctype, plte, trns } = png;
  for (let x = 0; x < w; x += 1) {
    const d = (y * w + x) * 4;
    if (ctype === 3) {
      const k = line[x] as number;
      px.set(plte.subarray(3 * k, 3 * k + 3), d);
      px[d + 3] = k < trns.length ? (trns[k] as number) : 255;
    } else if (ctype === 0) px.set([line[x] as number, line[x] as number, line[x] as number, 255], d);
    else if (ctype === 2) px.set([...line.subarray(3 * x, 3 * x + 3), 255], d);
    else px.set(line.subarray(4 * x, 4 * x + 4), d);
  }
};

export { paintRow };
