/* @layer bridge-wasm @kind logic */
import type { GateOptions } from '@chronoki/features';
import { aspectRatioOf } from './aspect-ratio-of';
import { fillBox } from './fill-box';
import { CT_FREE_RANGES } from './frame-ranges.constants';
import { wholeBoxOf } from './whole-box-of';

/* The ratio the picture is presented at: the chosen ratio, or the stage's own when the two-axis pixel perfect plan
   widened the frame to fill the stage (so the presenter does not clip it back to the ratio box). */
const pictureRatioOf = (effective: ReadonlySet<string>, options: GateOptions): number => {
  const ratio = aspectRatioOf(effective, options);
  const stage = options.stageArea;
  if (!(ratio > 0) || !stage || stage.height <= 0 || options.wholePixels !== true || !effective.has('tallRendering')) return ratio;
  const box = wholeBoxOf(stage, ratio, CT_FREE_RANGES);
  const contained = fillBox(ratio, stage);
  return box.width === contained.width && box.height === contained.height ? ratio : stage.width / stage.height;
};

export { pictureRatioOf };
