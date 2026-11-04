/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { changedSettingKeys } from './changed-setting-keys';
import { warnRestartNeeded } from './warn-restart-needed';
import type { SettingsEffectDeps } from './settings-effects.type';

const applySettingsEffects = (prev: AppSettings, next: AppSettings, isGameRunning: boolean, deps: Pick<SettingsEffectDeps, 'restartToastShownRef'>): void => {
  if (!isGameRunning) return;
  warnRestartNeeded({ ...deps, changedKeys: changedSettingKeys(prev, next) });
};

export { applySettingsEffects };
