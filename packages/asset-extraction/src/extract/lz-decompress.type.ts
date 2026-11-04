/* @layer shared-asset-extraction @kind types */

interface LzState {
  data: Uint8Array;
  start: number;
  bytePos: number;
  byteAfter: number;
  workPos: number;
  bitsCount: number;
  small: boolean;
  out: Uint8Array;
}

export type { LzState };
