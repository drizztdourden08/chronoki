/* @layer tests @kind helper */
import { ctFillWorldOf, exportCtWorld } from '@chronoki/game-core/archipelago';
import type { CtWorldInput, CtWorldKeys } from '@chronoki/game-core';
import { canCollectLocation, canReachEvent, createCollectionState, sweepPlacementSpheres } from '@drizztdourden08/brock-randomizer/world';
import type { CollectionState, World } from '@drizztdourden08/brock-randomizer/world';
import type { ReplayModel } from '@drizztdourden08/brock-randomizer/test-kit';

type CtState = CollectionState<World<CtWorldKeys>>;

interface NamedRow { key: string; name: string }

const EVENT_PREFIX = 'Event: ';

const WORLD_EXPORT = exportCtWorld();
const byName = (rows: readonly NamedRow[]): ReadonlyMap<string, string> => new Map(rows.map((row) => [row.name, row.key]));
const LOCATION_KEY = byName(WORLD_EXPORT['locations.json'] as readonly NamedRow[]);
const ITEM_KEY = byName(WORLD_EXPORT['items.json'] as readonly NamedRow[]);

const ctReplayModelOf = (input: CtWorldInput, seed: string): ReplayModel<CtState> => {
  const { world } = ctFillWorldOf(input, seed);
  return {
    locationKey: (name) => LOCATION_KEY.get(name),
    itemKey: (name) => ITEM_KEY.get(name),
    eventKey: (name) => (name.startsWith(EVENT_PREFIX) ? name.slice(EVENT_PREFIX.length) : undefined),
    place: (pairs) => {
      world.placedItems.clear();
      pairs.forEach(([location, item]) => world.placedItems.set(location as never, item as never));
    },
    startState: () => createCollectionState(world),
    reachedLocation: (state, key) => canCollectLocation(state, key as never),
    reachedEvent: (state, key) => canReachEvent(state, key as never),
    collect: (state, key) => state.collect(key as never),
    sweep: () => {
      const sweep = sweepPlacementSpheres(world);
      return { beaten: sweep.beaten, unreachable: sweep.uncollected.map(String) };
    },
  };
};

export { ctReplayModelOf };
