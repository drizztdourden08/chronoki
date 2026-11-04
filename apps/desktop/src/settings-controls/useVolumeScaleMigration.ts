/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const useVolumeScaleMigration = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { masterVolume } = settings;
  useEffect(() => {
    if (masterVolume <= 1) patch({ masterVolume: masterVolume * 100 });
  }, [masterVolume, patch]);
};

export { useVolumeScaleMigration };
