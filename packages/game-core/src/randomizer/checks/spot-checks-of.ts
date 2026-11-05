/* @layer bridge-wasm @kind logic */
import type { CtSpotId } from '../world/ct-world-keys.type';
import type { CheckDef } from './check.type';
import { SPOT_GIFTS } from './spot-gifts.constants';

const SPOT_GIFT_IDS: ReadonlySet<string> = new Set(SPOT_GIFTS.map((gift) => gift.spot));

const spotChecksOf = (checks: readonly CheckDef[]): ReadonlyMap<CtSpotId, string> | undefined => {
  const bound = checks.filter((check) => SPOT_GIFT_IDS.has(check.id)).map((check): [CtSpotId, string] => [check.id as CtSpotId, check.id]);
  return bound.length === 0 ? undefined : new Map(bound);
};

export { spotChecksOf };
