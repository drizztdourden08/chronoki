/* @layer shared-asset-extraction @kind types */
interface SpriteBuffer {
  name: string;
  bytes: Uint8Array;
}

interface ComposedFrame {
  indices: Uint8Array;
  palette: Uint8Array;
  box: [number, number, number, number];
}

interface RgbaImage {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
}

export type { ComposedFrame, RgbaImage, SpriteBuffer };
