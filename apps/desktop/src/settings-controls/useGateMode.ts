/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { GateMode } from '@chronoki/design';
import { FEATURES_BY_ID, resolveGates } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';

const useGateMode = (): GateMode => {
  const { settings } = useSettings<AppSettings>();
  if (settings.vanillaSafe) return 'original';
  const satisfied = new Set(settings.steamDataImported ? ['steamData'] : []);
  const { effective } = resolveGates(settings.gates, { vanillaSafe: false, satisfied });
  const changesGame = [...effective].some((id) => FEATURES_BY_ID[id]?.affectsVanillaParity === true);
  return changesGame ? 'modified' : 'original';
};

export { useGateMode };
