/* @layer bridge-wasm @kind logic */
import type { GateOptions } from '@chronoki/features';
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_ORIGINAL_RATIO } from './aspect.constants';
import type { CkFrameRanges, CkResolvedFrame } from './aspect.type';
import { aspectRatioOf } from './aspect-ratio-of';
import { coverFrame } from './cover-frame';
import { CT_FREE_RANGES, CT_TALL_RANGES, CT_WIDE_RANGES } from './frame-ranges.constants';
import { ORIGINAL_FRAME } from './resolve-frame.constants';
import { ratioToLines } from './ratio-to-lines';
import { ratioToWidth } from './ratio-to-width';

const rangesFor = (options: GateOptions, tallOn: boolean, tall: boolean): CkFrameRanges => {
  if (tallOn && options.wholePixels === true) return CT_FREE_RANGES;
  return tall ? CT_TALL_RANGES : CT_WIDE_RANGES;
};

const plannedFrame = (options: GateOptions, ratio: number, ranges: CkFrameRanges): CkResolvedFrame | null => {
  if (!options.stageArea) return null;
  const cover = coverFrame(options.stageArea, ratio, ranges, options.wholePixels === true);
  return { width: cover.width, lines: cover.height };
};

const resolveFrame = (effective: ReadonlySet<string>, options: GateOptions): CkResolvedFrame => {
  const ratio = aspectRatioOf(effective, options);
  if (!(ratio > 0)) return ORIGINAL_FRAME;
  const tallOn = effective.has('tallRendering');
  const tall = tallOn && ratio < CT_ORIGINAL_RATIO;
  const planned = plannedFrame(options, ratio, rangesFor(options, tallOn, tall));
  if (planned) return planned;
  return tall ? { width: CT_ASPECT_MIN_WIDTH, lines: ratioToLines(ratio) } : { width: ratioToWidth(ratio), lines: CT_ASPECT_HEIGHT };
};

export { resolveFrame };
