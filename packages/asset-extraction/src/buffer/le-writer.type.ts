/* @layer shared-asset-extraction @kind types */
interface LeWriter {
  u8: (v: number) => void;
  u16: (v: number) => void;
  u32: (v: number) => void;
  u64: (v: bigint) => void;
  i64: (v: bigint) => void;
  uint: (v: bigint, size: number) => void;
  bytes: (b: Uint8Array) => void;
  zeros: (n: number) => void;
  length: () => number;
  toBytes: () => Uint8Array;
}

export type { LeWriter };
