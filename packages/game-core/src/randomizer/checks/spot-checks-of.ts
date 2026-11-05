/* @layer bridge-wasm @kind logic */
import type { CtSpotId } from '../world/ct-world-keys.type';
import { SPOT_VANILLA_ITEMS } from '../world/spot-vanilla-items.constants';
import type { CheckDef } from './check.type';

const spotChecksOf = (checks: readonly CheckDef[]): ReadonlyMap<CtSpotId, string> | undefined => {
  const bound = checks.filter((check) => check.id in SPOT_VANILLA_ITEMS).map((check): [CtSpotId, string] => [check.id as CtSpotId, check.id]);
  return bound.length === 0 ? undefined : new Map(bound);
};

export { spotChecksOf };
