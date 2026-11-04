/* @layer renderer-components @kind logic */
import { DEFAULT_GATES } from '@chronoki/features';
import type { ProfileSettings } from '../behavior/profile-settings.type';
import { formatSettingValue } from './format-setting-value';
import type { SettingsKey } from './settings-sections.type';

const settingRowValue = (settings: NonNullable<ProfileSettings>, { key, format, gate }: SettingsKey): string => {
  if (!gate) return formatSettingValue(settings[key], format);
  const gates = Array.isArray(settings.gates) ? settings.gates : DEFAULT_GATES;
  return formatSettingValue(gates.includes(key));
};

export { settingRowValue };
