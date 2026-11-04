/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/tessera/composites';
import { isRestartKey } from './is-restart-key';
import { RESTART_TOAST_ID, RESTART_TOAST_MESSAGE } from './settings-effects.constants';
import type { SettingsEffectDeps } from './settings-effects.type';

const warnRestartNeeded = ({ changedKeys, restartToastShownRef }: SettingsEffectDeps): void => {
  if (restartToastShownRef.current || !changedKeys.some(isRestartKey)) return;
  restartToastShownRef.current = true;
  toast({ id: RESTART_TOAST_ID, message: RESTART_TOAST_MESSAGE, variant: 'danger', duration: 0 });
};

export { warnRestartNeeded };
