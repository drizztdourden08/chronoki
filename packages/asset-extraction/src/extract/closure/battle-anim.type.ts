/* @layer shared-asset-extraction @kind types */

interface WalkState {
  lens: number[];
  seen: Set<number>;
  supers: Set<number>;
}

interface WalkSpan {
  start: number;
  bankEnd: number;
  depth: number;
}

export type { WalkState, WalkSpan };
