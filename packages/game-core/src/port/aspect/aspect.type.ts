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

interface CkResolvedFrame {
  width: number;
  lines: number;
}

type CkPresentMode = 'stretch' | 'fit' | 'whole';

export type { CkArea, CkCoverFrame, CkFrameRanges, CkPresentMode, CkResolvedFrame };
