/* @layer renderer-app @kind logic */
import type { SettingLockCause } from '@drizztdourden08/brock-react';
import { isVanillaSafeLockedSetting, lockCauseOf as featureLockCause } from '@chronoki/features';
import { isPackaged } from '@app/launch-flags/is-packaged';
import type { AppSettings } from '@app/settings.type';
import { steamSatisfied } from './steam-satisfied';
import { effectiveGatesOf } from './effective-gates-of';
import { featureIdOf } from './feature-id-of';

const lockCauseOf = (key: string, settings: AppSettings): SettingLockCause | null => {
  if (settings.vanillaSafe && isVanillaSafeLockedSetting(key)) return 'vanillaSafe';
  const id = featureIdOf(key);
  if (id === null) return null;
  const satisfied = steamSatisfied();
  return featureLockCause(id, { vanillaSafe: settings.vanillaSafe, packaged: isPackaged(), enabled: effectiveGatesOf(settings), satisfied });
};

export { lockCauseOf };
