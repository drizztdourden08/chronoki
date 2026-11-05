/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { AppSettings } from '@app/settings.type';
import { modeOfProfile } from './mode-of-profile';
import type { ProfileModeId } from './profile-mode.type';

const useProfileMode = (profile: Profile | null | undefined): ProfileModeId => {
  const { settings } = useSettings<AppSettings>();
  return modeOfProfile(profile, settings.vanillaSafe);
};

export { useProfileMode };
