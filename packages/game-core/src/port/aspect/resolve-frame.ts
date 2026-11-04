/* @layer bridge-wasm @kind logic */
import type { GateOptions } from '@chronoki/features';
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_ORIGINAL_RATIO } from './aspect.constants';
import type { CkResolvedFrame } from './aspect.type';
import { aspectRatioOf } from './aspect-ratio-of';
import { coverFrame } from './cover-frame';
import { CT_TALL_RANGES, CT_WIDE_RANGES } from './frame-ranges.constants';
import { ORIGINAL_FRAME } from './resolve-frame.constants';
import { ratioToLines } from './ratio-to-lines';
import { ratioToWidth } from './ratio-to-width';

/* With the measured stage, the frame is planned to fill it (whole pixels under pixel perfect); without, it follows the ratio. */
const plannedFrame = (options: GateOptions, ratio: number, tall: boolean): CkResolvedFrame | null => {
  if (!options.stageArea) return null;
  const cover = coverFrame(options.stageArea, ratio, tall ? CT_TALL_RANGES : CT_WIDE_RANGES, options.wholePixels === true);
  return { width: cover.width, lines: cover.height };
};

const resolveFrame = (effective: ReadonlySet<string>, options: GateOptions): CkResolvedFrame => {
  const ratio = aspectRatioOf(effective, options);
  if (!(ratio > 0)) return ORIGINAL_FRAME;
  const tall = effective.has('tallRendering') && ratio < CT_ORIGINAL_RATIO;
  const planned = plannedFrame(options, ratio, tall);
  if (planned) return planned;
  return tall ? { width: CT_ASPECT_MIN_WIDTH, lines: ratioToLines(ratio) } : { width: ratioToWidth(ratio), lines: CT_ASPECT_HEIGHT };
};

export { resolveFrame };
