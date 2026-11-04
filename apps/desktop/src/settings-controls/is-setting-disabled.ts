/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { lockCauseOf } from './lock-cause-of';

const isSettingDisabled = (key: string, settings: AppSettings): boolean => {
  if (key === 'viewportConstraint') return settings.original;
  if (key === 'pixelPerfect') return settings.original || settings.viewportConstraint !== 'none';
  return lockCauseOf(key, settings) !== null;
};

export { isSettingDisabled };
