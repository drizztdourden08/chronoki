/* @layer shared-asset-extraction @kind types */
interface Successors {
  targets: number[];
  falls: boolean;
  next: number;
  m: number;
  x: number;
}

interface Work {
  adr: number;
  m: number;
  x: number;
  depth: number;
  image: string;
}

interface Decoded {
  op: number;
  bytes: number[];
  len: number;
}

export type { Decoded, Successors, Work };
