/* @layer bridge-wasm @kind logic */
import { defineRandomizerGame } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { CT_GAME, CT_OPTION_CATALOG, CT_PLACEMENT_SCHEMAS, describeCtPlacement } from '@chronoki/game-core';
import { chronokiCoreSignal } from './chronoki-core-signal';
import { chronokiMemoryBridge } from './chronoki-memory-bridge';
import { chronokiPollHooks } from './chronoki-poll-hooks';
import { CHRONOKI_RANDOMIZER_LABELS } from './chronoki-randomizer.constants';
import { chronokiSeedApplier } from './chronoki-seed-applier';
import { chronokiToConfig } from './chronoki-to-config';
import { chronokiWorldStamp } from './chronoki-world-stamp';
import { rollChronokiSeed } from './roll-chronoki-seed';

const chronokiRandomizerGame = defineRandomizerGame<CtPlacement>({
  id: CT_GAME,
  world: chronokiWorldStamp,
  placementSchemas: CT_PLACEMENT_SCHEMAS,
  core: chronokiCoreSignal,
  roll: rollChronokiSeed,
  describe: describeCtPlacement,
  memory: chronokiMemoryBridge,
  applier: chronokiSeedApplier,
  poll: chronokiPollHooks,
  profile: { toConfig: chronokiToConfig },
  catalog: CT_OPTION_CATALOG,
  labels: CHRONOKI_RANDOMIZER_LABELS,
});

export { chronokiRandomizerGame };
