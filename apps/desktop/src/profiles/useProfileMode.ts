/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import type { ProfileModeId } from './profile-mode.type';

const useProfileMode = (): ProfileModeId => {
  const { settings } = useSettings<AppSettings>();
  return settings.vanillaSafe ? 'vanilla-safe' : 'vanilla';
};

export { useProfileMode };
