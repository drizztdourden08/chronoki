/* @layer shared-asset-extraction @kind types */

interface Site {
  op: number;
  bytes: number[];
  len: number;
  m: number;
  x: number;
  traced: boolean;
  smc: boolean;
  variants: Set<string>;
  image: string;
}

type Sites = Map<number, Site>;

interface TracePair {
  text: string;
  image: string;
}

interface XlatInput {
  name: string;
  rom: Uint8Array;
  traces: TracePair[];
  images: Map<string, Uint8Array>;
  starts: Set<number>;
  stops: Set<number>;
}

export type { Site, Sites, TracePair, XlatInput };
