/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import { usePlatform } from '@drizztdourden08/brock-react';
import { appLog } from '@app/log/app-log';

const useRevealProfileFolder = (profileId: string | null) => {
  const { storage, capabilities } = usePlatform();

  const reveal = useCallback(() => {
    if (!profileId) return;
    storage.revealProfile(profileId)
      .then((opened) => { if (!opened) appLog.warn('Could not open the profile folder'); })
      .catch((error: unknown) => appLog.warn('Could not open the profile folder', error));
  }, [storage, profileId]);

  return { reveal, canReveal: capabilities.revealDataFolder && profileId !== null };
};

export { useRevealProfileFolder };
