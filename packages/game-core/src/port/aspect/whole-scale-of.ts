/* @layer bridge-wasm @kind logic */
import { CT_MAX_CROP_PIXELS } from './aspect.constants';
import type { CkArea } from './aspect.type';

const EPSILON = 1e-6;

const cropOf = (frame: number, scale: number, stage: number): number => Math.max(0, frame * scale - stage) / scale;

const wholeScaleOf = (stage: CkArea, frame: CkArea, allowCrop: boolean): number => {
  if (frame.width <= 0 || frame.height <= 0) return 1;
  const fit = Math.min(stage.width / frame.width, stage.height / frame.height);
  const down = Math.max(1, Math.floor(fit + EPSILON));
  if (!allowCrop) return down;
  const up = Math.max(1, Math.ceil(fit - EPSILON));
  const fits = cropOf(frame.width, up, stage.width) <= CT_MAX_CROP_PIXELS && cropOf(frame.height, up, stage.height) <= CT_MAX_CROP_PIXELS;
  return fits ? up : down;
};

export { wholeScaleOf };
