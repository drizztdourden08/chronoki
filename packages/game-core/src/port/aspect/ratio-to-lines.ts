/* @layer bridge-wasm @kind logic */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_SQUARE_PIXEL, CT_TALL_MAX_LINES } from './aspect.constants';

const ratioToLines = (ratio: number, pixelAspect: number = CT_SQUARE_PIXEL, baseLines: number = CT_ASPECT_HEIGHT): number => {
  if (!Number.isFinite(ratio) || ratio <= 0) return baseLines;
  const even = Math.floor((CT_ASPECT_MIN_WIDTH * pixelAspect) / ratio + 0.5) & ~1;
  return Math.min(CT_TALL_MAX_LINES, Math.max(baseLines, even));
};

export { ratioToLines };
