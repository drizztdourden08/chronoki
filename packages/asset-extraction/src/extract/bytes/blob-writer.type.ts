/* @layer shared-asset-extraction @kind types */

interface BlobWriter {
  u8: (v: number) => void;
  u16: (v: number) => void;
  i16: (v: number) => void;
  u32: (v: number) => void;
  i32: (v: number) => void;
  bytes: (b: ArrayLike<number>) => void;
  toBytes: () => Uint8Array;
}

export type { BlobWriter };
