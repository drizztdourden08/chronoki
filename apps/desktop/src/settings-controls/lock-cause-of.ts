/* @layer renderer-app @kind logic */
import type { SettingLockCause } from '@drizztdourden08/brock-react';
import { lockCauseOf as featureLockCause } from '@chronoki/features';
import { isPackaged } from '@app/launch-flags/is-packaged';
import type { AppSettings } from '@app/settings.type';
import { effectiveGatesOf } from './effective-gates-of';
import { featureIdOf } from './feature-id-of';

const lockCauseOf = (key: string, settings: AppSettings): SettingLockCause | null => {
  const id = featureIdOf(key);
  if (id === null) return null;
  const satisfied = new Set(settings.steamDataImported ? ['steamData'] : []);
  return featureLockCause(id, { vanillaSafe: settings.vanillaSafe, packaged: isPackaged(), enabled: effectiveGatesOf(settings), satisfied });
};

export { lockCauseOf };
