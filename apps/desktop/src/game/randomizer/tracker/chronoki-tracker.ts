/* @layer bridge-wasm @kind logic */
import type { TrackerProvider } from '@drizztdourden08/brock-randomizer/tracker';
import { trackerFromDef } from '@drizztdourden08/brock-randomizer/tracker';
import type { CtPlacement } from '@chronoki/game-core';
import { createCtWorldDef } from '@chronoki/game-core';
import { chronokiPollHooks } from '../chronoki-poll-hooks';
import { itemLabelOf } from '../item-label-of';
import { currentChecks } from './current-checks';
import { currentPollEntries } from './current-poll-entries';
import { heldOfView } from './held-of-view';
import { eraLabelOf } from './era-label-of';
import { locationNameOf } from './location-name-of';
import { ERA_GROUPING_ID, TRACKER_GROUPINGS } from './tracker.constants';

const baseOf = () => trackerFromDef(createCtWorldDef({ checks: currentChecks() }), {});

const chronokiTracker: TrackerProvider<CtPlacement> = {
  world: (input) => baseOf().world(input),
  worldKey: (input) => `${input.placement.seed}:${currentChecks().length}`,
  vanilla: () => baseOf().vanilla?.() as CtPlacement,
  sphereOf: (placement) => baseOf().sphereOf?.(placement) ?? new Map<string, number>(),
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
