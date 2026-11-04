/* @layer bridge-wasm @kind logic */
import { EPSILON } from './whole-scale-of.constants';
import type { CkArea } from './aspect.type';

/* The whole-pixel scale of a frame on a box: the smallest that covers it (the overflow is cropped, never a bar), or the largest
   that fits inside it (Original, which keeps its bars). */
const wholeScaleOf = (box: CkArea, frame: CkArea, cover: boolean): number => {
  if (frame.width <= 0 || frame.height <= 0) return 1;
  const across = box.width / frame.width;
  const down = box.height / frame.height;
  if (cover) return Math.max(1, Math.ceil(Math.max(across, down) - EPSILON));
  return Math.max(1, Math.floor(Math.min(across, down) + EPSILON));
};

export { wholeScaleOf };
