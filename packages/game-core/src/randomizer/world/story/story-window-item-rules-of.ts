/* @layer bridge-wasm @kind logic */
import type { ItemRule, WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from '../ct-world-keys.type';
import { treasureOnly } from '../treasure-only';
import { STORY_WINDOW_GIFTS } from './story-window-gifts.constants';

const storyWindowItemRulesOf = (treasure: readonly WorldLocation<CtWorldKeys>[]): [string, ItemRule<CtWorldKeys>][] =>
  treasure
    .filter((location) => STORY_WINDOW_GIFTS.has(location.key))
    .map((location): [string, ItemRule<CtWorldKeys>] => [location.key, treasureOnly]);

export { storyWindowItemRulesOf };
