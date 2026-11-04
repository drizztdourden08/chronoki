/* @layer shared-asset-extraction @kind type */
interface LoaderCapture {
  cells: number[];
  bands: [number, number][];
  cg: Uint8Array;
  vram: Uint8Array;
}

export type { LoaderCapture };
