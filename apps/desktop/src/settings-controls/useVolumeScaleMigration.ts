/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const VOLUME_SCALE = 100;

const useVolumeScaleMigration = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { masterVolume, volumeScale } = settings;
  useEffect(() => {
    if (volumeScale !== undefined) return;
    patch({ volumeScale: VOLUME_SCALE, masterVolume: masterVolume <= 1 ? masterVolume * VOLUME_SCALE : masterVolume });
  }, [masterVolume, volumeScale, patch]);
};

export { useVolumeScaleMigration };
