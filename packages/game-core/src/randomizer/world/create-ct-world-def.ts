/* @layer bridge-wasm @kind logic */
import type { GameWorldDef, ItemRule } from '@drizztdourden08/brock-randomizer/world';
import { goalOf } from './ct-goal';
import { CT_HELPERS } from './ct-helpers.constants';
import { ctOptionValues } from './ct-option-values';
import { CT_GAME, CT_OPTION_SCHEMAS, CT_PLACEMENT_SCHEMAS, CT_WORLD_SCHEMA } from './ct-world.constants';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtItem, CtWorldKeys } from './ct-world-keys.type';
import { joinCtChecks } from './join-ct-checks';
import { applyModeToRegions } from './modes/apply-mode-to-regions';
import { modeOf } from './modes/mode-of';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { ruleMapsOfRegions } from './rule-maps-of-regions';
import { treasureOnly } from './treasure-only';

const createCtWorldDef = (input: CtWorldInput): GameWorldDef<CtWorldKeys> => {
  const mode = modeOf(input.options);
  const specs = applyModeToRegions(CT_REGIONS, mode);
  const { regions, treasure } = joinCtChecks(input, specs);
  const { exitRules, spotRules, eventRules } = ruleMapsOfRegions(specs);
  const options = ctOptionValues(input.options);
  const rest = treasure.flatMap((location): CtItem[] =>
    (location.vanillaItem === undefined ? [] : [location.vanillaItem]));
  return {
    game: CT_GAME,
    worldSchema: CT_WORLD_SCHEMA,
    placementSchemas: CT_PLACEMENT_SCHEMAS,
    optionSchemas: CT_OPTION_SCHEMAS,
    start: mode.start,
    sweepsEvents: true,
    regions,
    exitRules,
    locationRules: spotRules,
    eventRules,
    itemRules: new Map(treasure.map((location): [string, ItemRule<CtWorldKeys>] => [location.key, treasureOnly])),
    helpers: CT_HELPERS,
    options: () => options,
    goal: goalOf(mode.goal),
    buildPool: () => ({ progression: [...mode.keyItems], rest: [...rest] }),
  };
};

export { createCtWorldDef };
