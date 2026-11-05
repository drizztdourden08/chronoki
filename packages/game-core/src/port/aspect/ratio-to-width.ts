/* @layer bridge-wasm @kind logic */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MAX_WIDTH, CT_ASPECT_MIN_WIDTH, CT_SQUARE_PIXEL } from './aspect.constants';

const ratioToWidth = (ratio: number, pixelAspect: number = CT_SQUARE_PIXEL, baseLines: number = CT_ASPECT_HEIGHT): number => {
  if (!Number.isFinite(ratio) || ratio <= 0) return CT_ASPECT_MIN_WIDTH;
  const even = Math.floor((ratio * baseLines) / pixelAspect + 0.5) & ~1;
  return Math.min(CT_ASPECT_MAX_WIDTH, Math.max(CT_ASPECT_MIN_WIDTH, even));
};

export { ratioToWidth };
