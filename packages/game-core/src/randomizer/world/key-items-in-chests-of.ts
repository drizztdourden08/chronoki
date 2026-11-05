/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from './ct-placement.type';
import { isCtKeyItem } from './is-ct-key-item';

const SPOT_PREFIX = 'ki-';

const keyItemsInChestsOf = (placement: CtPlacement): number =>
  placement.locations.filter(([location, item]) => isCtKeyItem(item) && !location.startsWith(SPOT_PREFIX)).length;

export { keyItemsInChestsOf };
