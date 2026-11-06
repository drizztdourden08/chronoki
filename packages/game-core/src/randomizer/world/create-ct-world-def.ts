/* @layer bridge-wasm @kind logic */
import type { GameWorldDef } from '@drizztdourden08/brock-randomizer/world';
import { ctWorldSpecsOf } from './ct-world-specs-of';
import { duplicateCharactersOf } from './duplicate-characters-of';
import { goalOf } from './goal-of';
import { CT_HELPERS } from './ct-helpers.constants';
import { ctOptionValues } from './ct-option-values';
import { CT_GAME, CT_OPTION_SCHEMAS, CT_PLACEMENT_SCHEMAS, CT_WORLD_SCHEMA } from './ct-world.constants';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtItem, CtWorldKeys } from './ct-world-keys.type';
import { joinCtChecks } from './join-ct-checks';
import { modeOf } from './modes/mode-of';
import { LEGACY_PARTY } from './recruits/legacy-party.constants';
import { shapeGoal } from './shape/shape-goal';
import { shapeSeedValues } from './shape/shape-seed-values';
import { poolFillerOf } from './pool-filler-of';
import { ruleMapsOfRegions } from './rule-maps-of-regions';
import { sealedRulesOf } from './sealed-rules-of';
import { keyItemsOf } from './epoch-fail/key-items-of';
import { pinRoboRibbon } from './pin-robo-ribbon';
import { pinSpotsPhase } from './pin-spots-phase';
import type { PinnedItem } from './pinned-item.type';
import { pinnedSourcesOf } from './pinned-sources-of';
import { withPinnedSources } from './with-pinned-sources';
import { unpinnedKeyItems } from './unpinned-key-items';
import { giverLessSpotRulesOf } from './giver-less-spot-rules-of';
import { treasureItemRulesOf } from './treasure-item-rules-of';
import { locationRulesOf } from './location-rules-of';
import { storyWindowItemRulesOf } from './story/story-window-item-rules-of';

const createCtWorldDef = (input: CtWorldInput): GameWorldDef<CtWorldKeys> => {
  const mode = modeOf(input.options);
  const options = ctOptionValues({ ...input.options, ...mode.forcedOptions });
  const epochFail = options.epochFail === true;
  const shaped = input.shape === 'one';
  const party = input.startParty ?? LEGACY_PARTY;
  const duplicate = duplicateCharactersOf(options);
  const { specs, scope, start, objectives, needed } = ctWorldSpecsOf(input, { mode, options, party, duplicate });
  const vanillaRoboRibbon = options.vanillaRoboRibbon === true;
  const joinInput = vanillaRoboRibbon ? { ...input, checks: pinRoboRibbon(input.checks) } : input;
  const joined = joinCtChecks(joinInput, specs, mode.excludeDroppedTreasure === true, scope);
  const { treasure } = joined;
  const { exitRules, spotRules, eventRules } = ruleMapsOfRegions(specs);
  const spotIds = scope.flatMap((spec) => spec.spots.map((spot) => spot.id));
  const modeKeyItems = keyItemsOf(mode, epochFail, vanillaRoboRibbon);
  const sources = pinnedSourcesOf(modeKeyItems, new Set(scope.map((spec) => spec.id)));
  const regions = withPinnedSources(joined.regions, sources);
  const pins = sources.map((source): PinnedItem => [source.key, source.item]);
  const keyItems = unpinnedKeyItems(modeKeyItems, pins);
  const rest = treasure.flatMap((location): CtItem[] =>
    (location.vanillaItem === undefined ? [] : [location.vanillaItem]));
  return {
    game: CT_GAME,
    worldSchema: CT_WORLD_SCHEMA,
    placementSchemas: CT_PLACEMENT_SCHEMAS,
    optionSchemas: CT_OPTION_SCHEMAS,
    start,
    sweepsEvents: true,
    ...(shaped ? { seedValues: () => shapeSeedValues(input, duplicate, { objectives, needed }) } : {}),
    regions,
    exitRules,
    locationRules: locationRulesOf(sealedRulesOf(spotRules, treasure, input.sealedCheckIds), treasure, sources),
    eventRules,
    itemRules: new Map([
      ...treasureItemRulesOf(treasure, options.chronosanity === true),
      ...giverLessSpotRulesOf(spotIds),
      ...storyWindowItemRulesOf(treasure),
    ]),
    helpers: CT_HELPERS,
    options: () => options,
    goal: shaped ? shapeGoal : goalOf(mode.goal, mode.goalEvent),
    fillPhases: [pinSpotsPhase(pins)],
    buildPool: () => ({
      progression: [...keyItems],
      rest: [
        ...rest,
        ...poolFillerOf(rest, spotIds.length, keyItems.length, { seed: input.fillerSeed, tabsanity: options.tabsanity === true }),
      ],
    }),
  };
};

export { createCtWorldDef };
