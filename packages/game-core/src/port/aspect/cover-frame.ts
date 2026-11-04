/* @layer bridge-wasm @kind logic */
import { CT_MAX_CROP_PIXELS } from './aspect.constants';
import { EPSILON } from './cover-frame.constants';
import type { CkArea, CkCoverFrame, CkFrameRanges } from './aspect.type';
import { containBox } from './contain-box';

const evenCeil = (value: number): number => Math.ceil(value / 2 - EPSILON) * 2;

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

const fixedAxisScale = (fixed: number, box: number, area: number): number => {
  const down = Math.max(1, Math.floor(box / fixed + EPSILON));
  const up = Math.max(1, Math.ceil(box / fixed - EPSILON));
  const cropFits = Math.max(0, fixed * up - area) / up <= CT_MAX_CROP_PIXELS;
  return cropFits && fixed * up - box <= box - fixed * down ? up : down;
};

const coverFrame = (area: CkArea, ratio: number, ranges: CkFrameRanges): CkCoverFrame => {
  const box = containBox(ratio, area);
  if (ranges.minHeight === ranges.maxHeight) {
    const scale = fixedAxisScale(ranges.maxHeight, box.height, area.height);
    return { width: clamp(evenCeil(box.width / scale), ranges.minWidth, ranges.maxWidth), height: ranges.maxHeight, scale };
  }
  const scale = fixedAxisScale(ranges.maxWidth, box.width, area.width);
  return { width: ranges.maxWidth, height: clamp(evenCeil(box.height / scale), ranges.minHeight, ranges.maxHeight), scale };
};

export { coverFrame };
