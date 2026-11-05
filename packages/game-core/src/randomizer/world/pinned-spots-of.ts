/* @layer bridge-wasm @kind logic */
import { UNBOUND_KEY_ITEM_SPOTS } from '../checks/key-item-spot-gifts.constants';
import type { CtKeyItem, CtSpotId } from './ct-world-keys.type';
import type { PinnedSpot } from './pinned-spot.type';
import { SPOT_VANILLA_ITEMS } from './spot-vanilla-items.constants';

const pinnedSpotsOf = (spots: readonly CtSpotId[], modeKeyItems: readonly CtKeyItem[]): PinnedSpot[] =>
  spots
    .filter((spot) => spot in UNBOUND_KEY_ITEM_SPOTS)
    .map((spot): PinnedSpot => [spot, SPOT_VANILLA_ITEMS[spot]])
    .filter(([, item]) => modeKeyItems.some((key) => key === item));

export { pinnedSpotsOf };
