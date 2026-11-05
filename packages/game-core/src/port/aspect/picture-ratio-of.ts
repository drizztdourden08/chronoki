/* @layer bridge-wasm @kind logic */
import type { GateOptions } from '@chronoki/features';
import { aspectRatioOf } from './aspect-ratio-of';
import { fillBox } from './fill-box';
import { CT_FREE_RANGES } from './frame-ranges.constants';
import { wholeBoxOf } from './whole-box-of';

const pictureRatioOf = (effective: ReadonlySet<string>, options: GateOptions): number => {
  const ratio = aspectRatioOf(effective, options);
  const stage = options.stageArea;
  if (!(ratio > 0) || !stage || stage.height <= 0 || options.wholePixels !== true || !effective.has('tallRendering')) return ratio;
  const box = wholeBoxOf(stage, ratio, CT_FREE_RANGES);
  const contained = fillBox(ratio, stage);
  return box.width === contained.width && box.height === contained.height ? ratio : stage.width / stage.height;
};

export { pictureRatioOf };
