/* @layer bridge-wasm @kind logic */
import type { ItemRule } from '@drizztdourden08/brock-randomizer/world';
import { UNBOUND_KEY_ITEM_SPOTS } from '../checks/key-item-spot-gifts.constants';
import type { CtSpotId, CtWorldKeys } from './ct-world-keys.type';
import { treasureOnly } from './treasure-only';

const giverLessSpotRulesOf = (spots: readonly CtSpotId[]): [string, ItemRule<CtWorldKeys>][] =>
  spots.filter((spot) => spot in UNBOUND_KEY_ITEM_SPOTS).map((spot): [string, ItemRule<CtWorldKeys>] => [spot, treasureOnly]);

export { giverLessSpotRulesOf };
