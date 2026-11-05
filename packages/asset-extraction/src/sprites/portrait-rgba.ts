/* @layer shared-asset-extraction @kind logic */
import type { RgbaImage } from './party-sprites.type';

const portraitRgba = (blob: Uint8Array): RgbaImage => {
  const width = blob[0] as number;
  const height = blob[1] as number;
  if (blob.length < 2 + width * height * 3) throw new Error('portrait blob too short');
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    rgba[i * 4] = blob[2 + i * 3] as number;
    rgba[i * 4 + 1] = blob[3 + i * 3] as number;
    rgba[i * 4 + 2] = blob[4 + i * 3] as number;
    rgba[i * 4 + 3] = 255;
  }
  return { width, height, rgba };
};

export { portraitRgba };
