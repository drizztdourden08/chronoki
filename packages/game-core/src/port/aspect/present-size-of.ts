/* @layer bridge-wasm @kind logic */
import type { CkArea, CkPresentMode } from './aspect.type';
import { containBox } from './contain-box';
import { presentRatioOf } from './present-ratio-of';
import { wholeScaleOf } from './whole-scale-of';

const presentSizeOf = (stage: CkArea, frame: CkArea, ratio: number, mode: CkPresentMode): CkArea => {
  if (mode === 'stretch') return stage;
  if (mode === 'whole') {
    const scale = wholeScaleOf(stage, frame, ratio > 0);
    return { width: frame.width * scale, height: frame.height * scale };
  }
  const box = containBox(presentRatioOf(frame, ratio), stage);
  return { width: Math.round(box.width), height: Math.round(box.height) };
};

export { presentSizeOf };
