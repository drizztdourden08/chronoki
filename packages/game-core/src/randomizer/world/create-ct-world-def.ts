/* @layer bridge-wasm @kind logic */
import type { GameWorldDef } from '@drizztdourden08/brock-randomizer/world';
import { applyBucketToRegions } from './bucket/apply-bucket-to-regions';
import { bucketCountsOf } from './bucket/bucket-counts-of';
import { objectivesOf } from './bucket/objectives-of';
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
  const moded = applyModeToRegions(CT_REGIONS, mode);
  const party = input.startParty ?? LEGACY_PARTY;
  const partied = applyStartPartyToRegions(
    applyEpochFailToRegions(moded), mode.start, party,
    { assignment: input.characters, duplicate: options.characterRando === true && options.duplicateCharacters === true },
  );
  const objectives = objectivesOf(input.options, input.fillerSeed ?? '', party);
  const specs = applyBucketToRegions(partied, objectives, bucketCountsOf(options, objectives.length).needed);
  const vanillaRoboRibbon = options.vanillaRoboRibbon === true;
  const joinInput = vanillaRoboRibbon ? { ...input, checks: pinRoboRibbon(input.checks) } : input;
  const joined = joinCtChecks(joinInput, specs, mode.excludeDroppedTreasure === true);
  const { treasure } = joined;
  const { exitRules, spotRules, eventRules } = ruleMapsOfRegions(specs);
  const spotIds = specs.flatMap((spec) => spec.spots.map((spot) => spot.id));
  const modeKeyItems = keyItemsOf(mode, epochFail, vanillaRoboRibbon);
  const sources = pinnedSourcesOf(modeKeyItems, new Set(specs.map((spec) => spec.id)));
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
    start: mode.start,
    sweepsEvents: true,
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
    goal: goalOf(mode.goal, mode.goalEvent),
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
