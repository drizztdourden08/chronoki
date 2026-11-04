/* @layer bridge-wasm @kind type */
import type { Placement } from './apply-seed.type';

type PackPlacementPlan = {
  pack: Placement;
  items: ReadonlyMap<string, string>;
  virtual: readonly (readonly [string, string])[];
  unbound: number;
};

export type { PackPlacementPlan };
