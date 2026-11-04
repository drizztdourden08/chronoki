/* @layer shared-asset-extraction @kind types */

interface WorldDumps {
  rom: Uint8Array;
  n: number;
  w: Uint8Array;
  v: Uint8Array;
  objw: Uint8Array;
}

export type { WorldDumps };
