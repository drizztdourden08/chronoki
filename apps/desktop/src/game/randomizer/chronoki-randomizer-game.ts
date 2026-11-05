/* @layer bridge-wasm @kind logic */
import { defineRandomizerGame } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { CT_GAME, CT_PLACEMENT_SCHEMAS, CT_WORLD_SCHEMA, ctUiOptions, describeCtPlacement } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import './archipelago/chronoki-randomizer.augment.type';
import { chronokiArchipelago } from './archipelago/chronoki-archipelago';
import { chronokiApStateStore } from './archipelago/chronoki-ap-state-store';
import { CHRONOKI_MODES } from './archipelago/chronoki-modes.constants';
import { onChronokiJoined } from './archipelago/chronoki-on-joined';
import { isCtPlacement } from './is-ct-placement';
import { chronokiMemoryBridge } from './chronoki-memory-bridge';
import { ChecksNotifySettings } from './checks-widget/ChecksNotifySettings';
import { chronokiDeliverer } from './chronoki-deliverer';
import { chronokiPollHooks } from './chronoki-poll-hooks';
import { CHRONOKI_INVENTORY } from './inventory/chronoki-inventory.constants';
import { chronokiTracker } from './tracker/chronoki-tracker';
import { CHRONOKI_RANDOMIZER_LABELS } from './chronoki-randomizer.constants';
import { chronokiSeedApplier } from './chronoki-seed-applier';
import { chronokiToConfig } from './chronoki-to-config';
import { rollChronokiSeed } from './roll-chronoki-seed';
import { ASIDE_LABEL, CT_LOG_RULES, CT_RUN_PANELS, CtOptionsAside, ctImpactOptionTabs } from './views';

const chronokiRandomizerGame = defineRandomizerGame<CtPlacement>({
  id: CT_GAME,
  world: { game: CT_GAME, worldSchema: CT_WORLD_SCHEMA },
  placementSchemas: CT_PLACEMENT_SCHEMAS,
  core: chronokiCore,
  roll: rollChronokiSeed,
  onJoined: onChronokiJoined,
  isPlacement: isCtPlacement,
  apState: chronokiApStateStore,
  archipelago: chronokiArchipelago,
  modes: CHRONOKI_MODES,
  describe: describeCtPlacement,
  memory: chronokiMemoryBridge,
  applier: chronokiSeedApplier,
  deliverer: chronokiDeliverer,
  poll: chronokiPollHooks,
  profile: { toConfig: chronokiToConfig },
  catalog: ctUiOptions(),
  labels: CHRONOKI_RANDOMIZER_LABELS,
  tracker: chronokiTracker,
  inventory: CHRONOKI_INVENTORY,
  views: {
    optionTabs: ctImpactOptionTabs,
    optionsAside: CtOptionsAside,
    optionsAsideLabel: ASIDE_LABEL,
    runPanels: CT_RUN_PANELS,
    logRules: CT_LOG_RULES,
    checksWidget: { settings: ChecksNotifySettings },
  },
});

export { chronokiRandomizerGame };
