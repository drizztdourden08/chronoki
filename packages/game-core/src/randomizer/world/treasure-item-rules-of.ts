/* @layer bridge-wasm @kind logic */
import type { ItemRule, WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import { CT_UNSORTED } from './ct-world.constants';
import type { CtWorldKeys } from './ct-world-keys.type';
import { treasureOnly } from './treasure-only';

const treasureItemRulesOf = (
  treasure: readonly WorldLocation<CtWorldKeys>[], chronosanity: boolean,
): Map<string, ItemRule<CtWorldKeys>> =>
  new Map(treasure
    .filter((location) => !chronosanity || location.region === CT_UNSORTED)
    .map((location): [string, ItemRule<CtWorldKeys>] => [location.key, treasureOnly]));

export { treasureItemRulesOf };
