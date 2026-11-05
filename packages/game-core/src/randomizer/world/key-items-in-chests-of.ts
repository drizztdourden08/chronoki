/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from './ct-placement.type';
import { isCtKeyItem } from './is-ct-key-item';
import { isPinnedPlacement } from './is-pinned-placement';
import { SPOT_PREFIX } from './key-items-in-chests-of.constants';

const keyItemsInChestsOf = (placement: CtPlacement): number =>
  placement.locations.filter(([location, item]) =>
    isCtKeyItem(item) && !location.startsWith(SPOT_PREFIX) && !isPinnedPlacement(location, item)).length;

export { keyItemsInChestsOf };
