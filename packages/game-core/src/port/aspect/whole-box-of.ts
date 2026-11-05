/* @layer bridge-wasm @kind logic */
import type { CkArea, CkFrameRanges } from './aspect.type';
import { fillBox } from './fill-box';
import { wholeFrame } from './whole-frame';
import { EPSILON } from './whole-frame.constants';

const sameArea = (a: CkArea, b: CkArea): boolean => a.width === b.width && a.height === b.height;

const clampedUp = (box: CkArea, ranges: CkFrameRanges, scale: number): boolean =>
  box.width / scale < ranges.minWidth - EPSILON || box.height / scale < ranges.minHeight - EPSILON;

/* The ratio box, or the whole stage when the frame minimum already pushes the picture past the box at a scale the
   stage keeps: the extra columns or lines then fill the stage instead of leaving bars. */
const wholeBoxOf = (stage: CkArea, ratio: number, ranges: CkFrameRanges): CkArea => {
  const box = fillBox(ratio, stage);
  if (box.width <= 0 || box.height <= 0 || sameArea(box, stage)) return box;
  const { scale } = wholeFrame(box, ranges);
  if (!clampedUp(box, ranges, scale)) return box;
  return wholeFrame(stage, ranges).scale === scale ? stage : box;
};

export { wholeBoxOf };
