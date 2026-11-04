/* @layer bridge-wasm @kind logic */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_SQUARE_PIXEL, CT_TALL_MAX_LINES } from './aspect.constants';

/* The tall picture's lines for a screen ratio A and pixel aspect p: clamp(even(round(256 p / A)), 224, 480). */
const ratioToLines = (ratio: number, pixelAspect: number = CT_SQUARE_PIXEL): number => {
  if (!Number.isFinite(ratio) || ratio <= 0) return CT_ASPECT_HEIGHT;
  const even = Math.floor((CT_ASPECT_MIN_WIDTH * pixelAspect) / ratio + 0.5) & ~1;
  return Math.min(CT_TALL_MAX_LINES, Math.max(CT_ASPECT_HEIGHT, even));
};

export { ratioToLines };
