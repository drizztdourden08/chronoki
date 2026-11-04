/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useProfilesStore, useSettingsStore } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { platformFiles } from '@app/storage/platform-files';
import { pendingLegacyFlag } from './storage/pending-legacy-flag';

const useLegacyModeMigration = (): void => {
  const store = useSettingsStore<AppSettings>();
  const hydrated = store((state) => state.hydrated);
  const profileId = useProfilesStore((state) => state.active?.id ?? null);
  useEffect(() => {
    if (!hydrated || profileId === null) return;
    void pendingLegacyFlag(platformFiles(), profileId)
      .then((pending) => { if (pending) store.getState().patch({ vanillaSafe: pending.flag }); })
      .catch(() => undefined);
  }, [hydrated, profileId, store]);
};

export { useLegacyModeMigration };
