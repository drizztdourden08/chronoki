/* @layer shared-asset-extraction @kind types */

interface WalkState {
  lens: number[];
  seen: Set<number>;
  supers: Set<number>;
}

export type { WalkState };
