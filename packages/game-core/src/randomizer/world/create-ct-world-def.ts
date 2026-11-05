/* @layer bridge-wasm @kind logic */
import type { GameWorldDef } from '@drizztdourden08/brock-randomizer/world';
import { goalOf } from './goal-of';
import { CT_HELPERS } from './ct-helpers.constants';
import { ctOptionValues } from './ct-option-values';
import { CT_GAME, CT_OPTION_SCHEMAS, CT_PLACEMENT_SCHEMAS, CT_WORLD_SCHEMA } from './ct-world.constants';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtItem, CtWorldKeys } from './ct-world-keys.type';
import { joinCtChecks } from './join-ct-checks';
import { applyEpochFailToRegions } from './epoch-fail/apply-epoch-fail-to-regions';
import { applyModeToRegions } from './modes/apply-mode-to-regions';
import { modeOf } from './modes/mode-of';
import { applyStartPartyToRegions } from './recruits/apply-start-party-to-regions';
import { LEGACY_PARTY } from './recruits/legacy-party.constants';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { poolFillerOf } from './pool-filler-of';
import { ruleMapsOfRegions } from './rule-maps-of-regions';
import { sealedRulesOf } from './sealed-rules-of';
import { keyItemsOf } from './epoch-fail/key-items-of';
import { pinRoboRibbon } from './pin-robo-ribbon';
import { treasureItemRulesOf } from './treasure-item-rules-of';

const createCtWorldDef = (input: CtWorldInput): GameWorldDef<CtWorldKeys> => {
  const mode = modeOf(input.options);
  const options = ctOptionValues({ ...input.options, ...mode.forcedOptions });
  const epochFail = options.epochFail === true;
  const moded = applyModeToRegions(CT_REGIONS, mode);
  const specs = applyStartPartyToRegions(
    epochFail ? applyEpochFailToRegions(moded) : moded, mode.start, input.startParty ?? LEGACY_PARTY, input.characters,
  );
  const vanillaRoboRibbon = options.vanillaRoboRibbon === true;
  const joinInput = vanillaRoboRibbon ? { ...input, checks: pinRoboRibbon(input.checks) } : input;
  const { regions, treasure } = joinCtChecks(joinInput, specs, mode.excludeDroppedTreasure === true);
  const { exitRules, spotRules, eventRules } = ruleMapsOfRegions(specs);
  const keyItems = keyItemsOf(mode, epochFail, vanillaRoboRibbon);
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
    locationRules: sealedRulesOf(spotRules, treasure, input.sealedCheckIds),
    eventRules,
    itemRules: treasureItemRulesOf(treasure, options.chronosanity === true),
    helpers: CT_HELPERS,
    options: () => options,
    goal: goalOf(mode.goal, mode.goalEvent),
    buildPool: () => ({
      progression: [...keyItems],
      rest: [...rest, ...poolFillerOf(rest, specs.flatMap((spec) => spec.spots).length, keyItems.length, input.fillerSeed, options.tabsanity === true)],
    }),
  };
};

export { createCtWorldDef };
