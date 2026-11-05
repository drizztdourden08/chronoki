/* @layer bridge-wasm @kind logic */
import type { CtSpotId } from '../world/ct-world-keys.type';
import type { CheckDef } from './check.type';
import { KEY_ITEM_SPOT_GIFTS } from './key-item-spot-gifts.constants';
import { SPOT_GIFT_IDS } from './spot-checks-of.constants';

const spotChecksOf = (checks: readonly CheckDef[]): ReadonlyMap<CtSpotId, string> | undefined => {
  const byId = new Map(checks.map((check): [string, CheckDef] => [check.id, check]));
  const gifts = checks.filter((check) => SPOT_GIFT_IDS.has(check.id)).map((check): [CtSpotId, string] => [check.id as CtSpotId, check.id]);
  const keyItems = KEY_ITEM_SPOT_GIFTS.filter((gift) => {
    const check = byId.get(gift.check);
    return check?.kind === 'gift' && check.vanillaItem === gift.item;
  }).map((gift): [CtSpotId, string] => [gift.spot, gift.check]);
  const bound = [...gifts, ...keyItems];
  return bound.length === 0 ? undefined : new Map(bound);
};

export { spotChecksOf };
