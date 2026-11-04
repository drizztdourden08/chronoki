/* @layer shared-asset-extraction @kind types */

type HandlerLength = [number, number | null];
type Seen = [string, string, number];
type Walk = [number, number, number, number | null, Seen[]];

interface Cursor {
  p: number;
  m: number;
  x: number;
  ldy: number | null;
  prev: Seen[];
}

interface WalkCtx {
  rom: Uint8Array;
  seen: Set<string>;
  work: Walk[];
  rets: number[];
  rel: number | null;
}

export type { HandlerLength, Seen, Walk, Cursor, WalkCtx };
