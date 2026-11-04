/* @layer renderer-components @kind logic */
import { DEFAULT_GATES } from '@chronoki/features';
import { RANDOMIZER_GATE } from '@app/game/randomizer';
import type { AppSettings } from '@app/settings.type';

const withRandomizerGate = (config: Partial<AppSettings>, randomizer: boolean): Partial<AppSettings> => {
  if (!randomizer) return config;
  const gates = config.gates ?? DEFAULT_GATES;
  return gates.includes(RANDOMIZER_GATE) ? config : { ...config, gates: [...gates, RANDOMIZER_GATE] };
};

export { withRandomizerGate };
