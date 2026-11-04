/* @layer bridge-wasm @kind logic */
import { EPSILON } from './cover-frame.constants';
import type { CkArea, CkAxisPlan, CkCoverFrame, CkFrameAxis, CkFrameRanges } from './aspect.type';
import { fillBox } from './fill-box';
import { wholeFrame } from './whole-frame';

const evenCeil = (value: number): number => Math.ceil(value / 2 - EPSILON) * 2;

const evenRound = (value: number): number => Math.floor(value + 0.5) & ~1;

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

const planWhole = (axis: CkFrameAxis): CkAxisPlan => {
  const scale = Math.max(1, Math.ceil(axis.boxFixed / axis.fixed - EPSILON), Math.ceil(axis.boxFree / axis.max - EPSILON));
  return { free: clamp(evenCeil(axis.boxFree / scale), axis.min, axis.max), scale };
};

const planFit = (axis: CkFrameAxis): CkAxisPlan => {
  const free = clamp(evenRound((axis.fixed * axis.boxFree) / axis.boxFixed), axis.min, axis.max);
  return { free, scale: Math.max(axis.boxFixed / axis.fixed, axis.boxFree / free) };
};

const coverFrame = (area: CkArea, ratio: number, ranges: CkFrameRanges, whole: boolean): CkCoverFrame => {
  const box = fillBox(ratio, area);
  if (box.width <= 0 || box.height <= 0) return { width: ranges.minWidth, height: ranges.minHeight, scale: 1 };
  const wide = ranges.minHeight === ranges.maxHeight;
  if (whole && !wide && ranges.minWidth !== ranges.maxWidth) return wholeFrame(box, ranges);
  const axis: CkFrameAxis = wide
    ? { fixed: ranges.maxHeight, boxFixed: box.height, boxFree: box.width, min: ranges.minWidth, max: ranges.maxWidth }
    : { fixed: ranges.maxWidth, boxFixed: box.width, boxFree: box.height, min: ranges.minHeight, max: ranges.maxHeight };
  const { free, scale } = whole ? planWhole(axis) : planFit(axis);
  return wide ? { width: free, height: axis.fixed, scale } : { width: axis.fixed, height: free, scale };
};

export { coverFrame };
