/* @layer bridge-wasm @kind logic */
import type { CkArea, CkCoverFrame, CkFrameRanges } from './aspect.type';
import { EPSILON } from './whole-frame.constants';

const evenCeil = (value: number): number => Math.ceil(value / 2 - EPSILON) * 2;

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

/* Pixel perfect on both axes (wide_width and tall_lines together): the largest whole scale that keeps the frame at least its
   minimum size (224 lines, 256 wide), raised only when the box would need more than the maximum (544 wide, 480 lines); then
   the frame is the box divided by it, so the picture fills the box with under one scale step of crop on each axis.
   1920x1080 -> x4, 480x270; 1280x720 -> x3, 428x240; 810x1080 -> x3, 270x360. */
const wholeFrame = (box: CkArea, ranges: CkFrameRanges): CkCoverFrame => {
  const fits = Math.min(Math.floor(box.height / ranges.minHeight + EPSILON), Math.floor(box.width / ranges.minWidth + EPSILON));
  const needs = Math.max(Math.ceil(box.width / ranges.maxWidth - EPSILON), Math.ceil(box.height / ranges.maxHeight - EPSILON));
  const scale = Math.max(1, fits, needs);
  return {
    width: clamp(evenCeil(box.width / scale), ranges.minWidth, ranges.maxWidth),
    height: clamp(evenCeil(box.height / scale), ranges.minHeight, ranges.maxHeight),
    scale,
  };
};

export { wholeFrame };
