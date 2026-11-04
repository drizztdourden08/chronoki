/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { RETIRED_SETTING_KEYS } from './normalise-settings.constants';

const dropRetiredKeys = (settings: AppSettings): AppSettings => {
  const kept = Object.entries(settings).filter(([key]) => !RETIRED_SETTING_KEYS.includes(key));
  return Object.fromEntries(kept) as AppSettings;
};

export { dropRetiredKeys };
