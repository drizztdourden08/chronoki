/* @layer shared-asset-extraction @kind types */
interface PngChunks {
  idat: Uint8Array[];
  plte: Uint8Array;
  trns: Uint8Array;
  w: number;
  h: number;
  depth: number;
  ctype: number;
}

export type { PngChunks };
