/* @layer renderer-app @kind logic */
import type { SettingLockCause } from '@drizztdourden08/brock-react';
import { lockCauseOf as featureLockCause, resolveGates } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';
import { featureIdOf } from './feature-id-of';

const lockCauseOf = (key: string, settings: AppSettings): SettingLockCause | null => {
  const id = featureIdOf(key);
  if (id === null) return null;
  const vanillaSafe = settings.original;
  const satisfied = new Set(settings.steamDataImported ? ['steamData'] : []);
  const { effective } = resolveGates(settings.gates, { vanillaSafe, satisfied });
  return featureLockCause(id, { vanillaSafe, enabled: effective, satisfied });
};

export { lockCauseOf };
