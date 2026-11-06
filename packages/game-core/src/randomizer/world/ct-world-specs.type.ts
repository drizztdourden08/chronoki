/* @layer bridge-wasm @kind type */
import type { ObjectiveDef } from './bucket/objective-def.type';
import type { CtRegionSpec } from './ct-region-spec.type';
import type { CtRegionId } from './ct-world-keys.type';

type CtWorldSpecs = {
  specs: CtRegionSpec[];
  scope: readonly CtRegionSpec[];
  start: CtRegionId;
  objectives: ObjectiveDef[];
  needed: number;
};

export type { CtWorldSpecs };
