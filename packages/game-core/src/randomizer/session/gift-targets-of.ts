/* @layer bridge-wasm @kind logic */
import type { Placement } from '../apply/apply-seed.type';
import type { CheckDef } from '../checks/check.type';
import type { GiftTarget } from './watch.type';

const giftTargetsOf = (checks: readonly CheckDef[], pack: Placement): GiftTarget[] =>
  checks.flatMap((check): GiftTarget[] => {
    const item = pack[check.id];
    if (check.kind !== 'gift' || item === undefined) return [];
    return [{ id: check.id, locationId: check.locationId, item }];
  });

export { giftTargetsOf };
