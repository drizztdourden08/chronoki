/* @layer bridge-wasm @kind logic */
import type { CkArea, CkCoverFrame, CkFrameRanges } from './aspect.type';
import { EPSILON } from './whole-frame.constants';

const evenCeil = (value: number): number => Math.ceil(value / 2 - EPSILON) * 2;

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

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
