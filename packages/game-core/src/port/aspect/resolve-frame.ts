/* @layer bridge-wasm @kind logic */
import type { GateOptions } from '@chronoki/features';
import { CT_ASPECT_MIN_WIDTH, CT_EXTENDED_LINES, CT_EXTENDED_RATIO } from './aspect.constants';
import type { CkFrameRanges, CkResolvedFrame } from './aspect.type';
import { aspectRatioOf } from './aspect-ratio-of';
import { cappedLines } from './capped-lines';
import { coverFrame } from './cover-frame';
import { CT_FREE_RANGES, CT_TALL_RANGES, CT_WIDE_RANGES } from './frame-ranges.constants';
import { EXTENDED_ORIGINAL_FRAME, ORIGINAL_FRAME } from './resolve-frame.constants';
import { ratioToLines } from './ratio-to-lines';
import { ratioToWidth } from './ratio-to-width';

const rangesFor = (options: GateOptions, tallOn: boolean, tall: boolean, lines: number): CkFrameRanges => {
  if (tallOn && options.wholePixels === true) return CT_FREE_RANGES;
  return tall ? CT_TALL_RANGES : { ...CT_WIDE_RANGES, minHeight: lines, maxHeight: lines };
};

const plannedFrame = (options: GateOptions, ratio: number, ranges: CkFrameRanges): CkResolvedFrame | null => {
  if (!options.stageArea) return null;
  const cover = coverFrame(options.stageArea, ratio, ranges, options.wholePixels === true);
  return { width: cover.width, lines: cover.height };
};

const resolveFrame = (effective: ReadonlySet<string>, options: GateOptions): CkResolvedFrame => {
  const ratio = aspectRatioOf(effective, options);
  if (!(ratio > 0)) return effective.has('widescreen') && effective.has('extendY') ? EXTENDED_ORIGINAL_FRAME : ORIGINAL_FRAME;
  const tallOn = effective.has('tallRendering');
  const tall = tallOn && ratio < CT_EXTENDED_RATIO;
  const lines = cappedLines(ratio);
  const planned = plannedFrame(options, ratio, rangesFor(options, tallOn, tall, lines));
  if (planned) return planned;
  return tall
    ? { width: CT_ASPECT_MIN_WIDTH, lines: ratioToLines(ratio, 1, CT_EXTENDED_LINES) }
    : { width: ratioToWidth(ratio, 1, lines), lines };
};

export { resolveFrame };
