/* @layer bridge-wasm @kind logic */
import { defineRandomizerGame } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { CT_GAME, CT_OPTION_CATALOG, CT_PLACEMENT_SCHEMAS, CT_WORLD_SCHEMA, describeCtPlacement } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { chronokiMemoryBridge } from './chronoki-memory-bridge';
import { chronokiPollHooks } from './chronoki-poll-hooks';
import { CHRONOKI_INVENTORY } from './inventory/chronoki-inventory.constants';
import { chronokiTracker } from './tracker/chronoki-tracker';
import { CHRONOKI_RANDOMIZER_LABELS } from './chronoki-randomizer.constants';
import { chronokiSeedApplier } from './chronoki-seed-applier';
import { chronokiToConfig } from './chronoki-to-config';
import { rollChronokiSeed } from './roll-chronoki-seed';

const chronokiRandomizerGame = defineRandomizerGame<CtPlacement>({
  id: CT_GAME,
  world: { game: CT_GAME, worldSchema: CT_WORLD_SCHEMA },
  placementSchemas: CT_PLACEMENT_SCHEMAS,
  core: chronokiCore,
  roll: rollChronokiSeed,
  describe: describeCtPlacement,
  memory: chronokiMemoryBridge,
  applier: chronokiSeedApplier,
  poll: chronokiPollHooks,
  profile: { toConfig: chronokiToConfig },
  catalog: CT_OPTION_CATALOG,
  labels: CHRONOKI_RANDOMIZER_LABELS,
  tracker: chronokiTracker,
  inventory: CHRONOKI_INVENTORY,
});

export { chronokiRandomizerGame };
