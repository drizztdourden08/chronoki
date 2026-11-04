/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { readConfig } from '@app/profiles/storage';
import { platformFiles } from '@app/storage/platform-files';
import type { ProfileSettings } from './profile-settings.type';

const useProfileSettings = (profileId: string): ProfileSettings | undefined => {
  const [settings, setSettings] = useState<ProfileSettings | undefined>(undefined);

  useEffect(() => {
    let current = true;
    setSettings(undefined);
    void readConfig(platformFiles(), profileId)
      .catch(() => null)
      .then((loaded) => { if (current) setSettings(loaded); });
    return () => { current = false; };
  }, [profileId]);

  return settings;
};

export { useProfileSettings };
