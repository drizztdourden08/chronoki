/* @layer shared-asset-extraction @kind types */
interface Metatile {
  t: number;
  corners: [number, number, number][];
}

interface Margin {
  w: number;
  h: number;
  planes: Uint8Array;
  slots: number[];
  metas: Metatile[];
  pages: [number, string][];
}

export type { Metatile, Margin };
