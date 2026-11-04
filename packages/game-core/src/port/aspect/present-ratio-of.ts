/* @layer bridge-wasm @kind logic */
import type { CkArea } from './aspect.type';
import { MATCH_PIXELS } from './present-ratio-of.constants';

const presentRatioOf = (frame: CkArea, ratio: number): number => {
  const own = frame.height > 0 ? frame.width / frame.height : 0;
  if (!(ratio > 0)) return own;
  const matches = Math.abs(ratio * frame.height - frame.width) <= MATCH_PIXELS && Math.abs(frame.width / ratio - frame.height) <= MATCH_PIXELS;
  return matches ? ratio : own;
};

export { presentRatioOf };
