/* @layer bridge-wasm @kind logic */
import type { CkArea, CkPresentMode } from './aspect.type';
import { containBox } from './contain-box';
import { fillBox } from './fill-box';
import { wholeScaleOf } from './whole-scale-of';

const rounded = (area: CkArea): CkArea => ({ width: Math.round(area.width), height: Math.round(area.height) });

/* The box the picture shows on the stage: the stage when stretched; for a wide or tall ratio its fill box (the whole stage
   when the ratio matches it); for Original the frame's own shape inside the stage, whole-scaled under pixel perfect. */
const presentBoxOf = (stage: CkArea, frame: CkArea, ratio: number, mode: CkPresentMode): CkArea => {
  if (mode === 'stretch') return stage;
  if (ratio > 0) return rounded(fillBox(ratio, stage));
  if (mode === 'whole') {
    const scale = wholeScaleOf(stage, frame, false);
    return { width: frame.width * scale, height: frame.height * scale };
  }
  return rounded(containBox(frame.height > 0 ? frame.width / frame.height : 0, stage));
};

export { presentBoxOf };
