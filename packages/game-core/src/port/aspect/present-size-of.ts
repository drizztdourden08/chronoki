/* @layer bridge-wasm @kind logic */
import type { CkArea, CkPresentMode } from './aspect.type';
import { presentBoxOf } from './present-box-of';
import { EPSILON } from './present-size-of.constants';
import { wholeScaleOf } from './whole-scale-of';

/* The canvas size on the stage. Original is its box (bars beside it). A wide or tall picture covers its box: by the smallest
   whole scale under pixel perfect, else by the exact scale; what passes the box is cropped, never a bar. */
const presentSizeOf = (stage: CkArea, frame: CkArea, ratio: number, mode: CkPresentMode): CkArea => {
  const box = presentBoxOf(stage, frame, ratio, mode);
  if (mode === 'stretch' || !(ratio > 0) || frame.width <= 0 || frame.height <= 0) return box;
  if (mode === 'whole') {
    const scale = wholeScaleOf(box, frame, true);
    return { width: frame.width * scale, height: frame.height * scale };
  }
  const scale = Math.max(box.width / frame.width, box.height / frame.height);
  return { width: Math.ceil(frame.width * scale - EPSILON), height: Math.ceil(frame.height * scale - EPSILON) };
};

export { presentSizeOf };
