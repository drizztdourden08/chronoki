/* @layer shared-asset-extraction @kind type */
interface FrameLayout {
  blob: Uint8Array;
  tilesAt: number;
  ntiles: number;
  frameAt: number;
  offsAt: number;
  indices: Uint8Array;
  box: [number, number, number, number];
}

interface TilePlacement {
  tileAt: number;
  flipX: boolean;
  flipY: boolean;
  originX: number;
  originY: number;
}

export type { FrameLayout, TilePlacement };
