/* @layer bridge-wasm @kind types */
interface CkArea {
  width: number;
  height: number;
}

interface CkFrameRanges {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

interface CkCoverFrame {
  width: number;
  height: number;
  scale: number;
}

interface CkFrameAxis {
  fixed: number;
  boxFixed: number;
  boxFree: number;
  min: number;
  max: number;
}

interface CkAxisPlan {
  free: number;
  scale: number;
}

interface CkResolvedFrame {
  width: number;
  lines: number;
}

type CkPresentMode = 'stretch' | 'fit' | 'whole';

export type { CkArea, CkAxisPlan, CkCoverFrame, CkFrameAxis, CkFrameRanges, CkPresentMode, CkResolvedFrame };
