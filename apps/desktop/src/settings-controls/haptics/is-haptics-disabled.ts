/* @layer renderer-components @kind logic */
import type { AppSettings } from '@app/settings.type';

const isHapticsSettingDisabled = (key: string, settings: AppSettings): boolean => {
  if (key === 'haptics.enabled' || !key.startsWith('haptics.')) return false;
  return !settings.haptics.enabled;
};

export { isHapticsSettingDisabled };
