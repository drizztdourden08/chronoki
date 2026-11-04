/* @layer bridge-wasm @kind logic */
import type { GameWorldDef, ItemRule } from '@drizztdourden08/brock-randomizer/world';
import { ctGoal } from './ct-goal';
import { CT_HELPERS } from './ct-helpers.constants';
import { CT_KEY_ITEMS } from './ct-key-items.constants';
import { ctOptionValues } from './ct-option-values';
import { CT_EVENT_RULES, CT_EXIT_RULES, CT_SPOT_RULES } from './ct-rule-maps.constants';
import {
  CT_GAME, CT_OPTION_SCHEMAS, CT_PLACEMENT_SCHEMAS, CT_START, CT_WORLD_SCHEMA,
} from './ct-world.constants';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtItem, CtWorldKeys } from './ct-world-keys.type';
import { joinCtChecks } from './join-ct-checks';
import { treasureOnly } from './treasure-only';

const createCtWorldDef = (input: CtWorldInput): GameWorldDef<CtWorldKeys> => {
  const { regions, treasure } = joinCtChecks(input);
  const options = ctOptionValues(input.options);
  const rest = treasure.flatMap((location): CtItem[] =>
    (location.vanillaItem === undefined ? [] : [location.vanillaItem]));
  return {
    game: CT_GAME,
    worldSchema: CT_WORLD_SCHEMA,
    placementSchemas: CT_PLACEMENT_SCHEMAS,
    optionSchemas: CT_OPTION_SCHEMAS,
    start: CT_START,
    sweepsEvents: true,
    regions,
    exitRules: CT_EXIT_RULES,
    locationRules: CT_SPOT_RULES,
    eventRules: CT_EVENT_RULES,
    itemRules: new Map(treasure.map((location): [string, ItemRule<CtWorldKeys>] => [location.key, treasureOnly])),
    helpers: CT_HELPERS,
    options: () => options,
    goal: ctGoal,
    buildPool: () => ({ progression: [...CT_KEY_ITEMS], rest: [...rest] }),
  };
};

export { createCtWorldDef };
