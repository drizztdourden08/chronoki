/* @layer bridge-wasm @kind logic */
import type { TrackerProvider } from '@drizztdourden08/brock-randomizer/tracker';
import { trackerFromDef } from '@drizztdourden08/brock-randomizer/tracker';
import type { CtPlacement } from '@chronoki/game-core';
import { createCtWorldDef } from '@chronoki/game-core';
import { chronokiPollHooks } from '../chronoki-poll-hooks';
import { itemLabelOf } from '../item-label-of';
import { currentPollEntries } from './current-poll-entries';
import { heldOfView } from './held-of-view';
import { eraLabelOf } from './era-label-of';
import { locationNameOf } from './location-name-of';
import { trackerWorldInput } from './tracker-world-input';
import { vanillaOf } from './vanilla-of';
import { worldKeyOf } from './world-key-of';
import { ERA_GROUPING_ID, TRACKER_GROUPINGS } from './tracker.constants';

const baseOf = (placement?: CtPlacement) => trackerFromDef(createCtWorldDef(trackerWorldInput(placement)), {});

const chronokiTracker: TrackerProvider<CtPlacement> = {
  world: (input) => baseOf(input.placement).world(input),
  worldKey: (input) => worldKeyOf(input.placement),
  vanilla: () => vanillaOf(() => baseOf().vanilla?.()),
  sphereOf: (placement) => baseOf(placement).sphereOf?.(placement) ?? new Map<string, number>(),
  get checks() {
    return currentPollEntries();
  },
  completed: chronokiPollHooks.completed,
  held: heldOfView,
  groupings: TRACKER_GROUPINGS,
  groupOf: (location, grouping) => (grouping === ERA_GROUPING_ID ? eraLabelOf(location) : location),
  labelOf: locationNameOf,
  itemLabelOf,
};

export { chronokiTracker };
