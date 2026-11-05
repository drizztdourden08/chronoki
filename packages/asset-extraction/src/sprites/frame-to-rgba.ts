/* @layer shared-asset-extraction @kind logic */
import { SPR_W } from './party-sprites.constants';
import type { ComposedFrame, RgbaImage } from './party-sprites.type';

const frameToRgba = (frame: ComposedFrame): RgbaImage => {
  const [x0, y0, x1, y1] = frame.box;
  const width = Math.max(0, x1 - x0 + 1);
  const height = Math.max(0, y1 - y0 + 1);
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const v = frame.indices[(y0 + y) * SPR_W + x0 + x] as number;
      if (!v) continue;
      const at = (y * width + x) * 4;
      rgba[at] = frame.palette[v * 3] as number;
      rgba[at + 1] = frame.palette[v * 3 + 1] as number;
      rgba[at + 2] = frame.palette[v * 3 + 2] as number;
      rgba[at + 3] = 255;
    }
  }
  return { width, height, rgba };
};

export { frameToRgba };
