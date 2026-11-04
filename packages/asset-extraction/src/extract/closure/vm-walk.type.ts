/* @layer shared-asset-extraction @kind types */

type Span = [number, number];
type Mem7f = [Uint8Array, [number, number]];

interface VmReader {
  o: number | null;
  rd: (k: number) => number;
}

interface VmDecoded {
  ln: number;
  rel: number | null;
  ops: number[];
}

interface VmCtx {
  rom: Uint8Array;
  mem7f: Mem7f | null;
  lens: Map<number, [number, number | null]>;
  seen: Set<string>;
  spans: Span[];
  data: Span[];
  work: [number, number][];
}

interface VmCursor {
  bank: number;
  pc: number;
}

export type { Span, Mem7f, VmReader, VmDecoded, VmCtx, VmCursor };
