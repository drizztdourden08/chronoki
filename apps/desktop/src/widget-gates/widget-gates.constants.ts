/* @layer renderer-app @kind data */
import type { WidgetGate } from '@drizztdourden08/brock-react';

const VANILLA_SAFE_ID = 'vanillaSafe';

const WIDGET_GATES: Readonly<Record<string, WidgetGate>> = {
  'game-info': { readsGameData: true, requiresSetting: 'gameInfo' },
  checks: { readsGameData: true },
  inventory: { readsGameData: true },
  cheats: { readsGameData: true, requiresSetting: 'cheatsEnabled' },
  music: { readsGameData: true },
};

const WIDGET_GATE_MESSAGES: Readonly<Record<string, string>> = {
  [VANILLA_SAFE_ID]: 'Disabled in Vanilla Safe mode',
  gameInfo: 'Game Info widget is disabled',
  cheatsEnabled: 'Cheats are disabled',
};

const WIDGET_GATE_FALLBACK_TARGET = 'gameplay';

export { VANILLA_SAFE_ID, WIDGET_GATE_FALLBACK_TARGET, WIDGET_GATE_MESSAGES, WIDGET_GATES };
