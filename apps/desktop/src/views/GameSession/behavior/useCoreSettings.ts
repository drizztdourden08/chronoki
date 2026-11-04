/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { buildCoreConfigIni, DEFAULT_CK_SETTINGS } from '@chronoki/game-core';
import type { CkSettings } from '@chronoki/game-core';
import { startupFlag } from '@app/launch-flags/startup-flag';
import type { AppSettings } from '@app/settings.type';

const useCoreSettings = (): { settings: CkSettings; config: string; volume: number } => {
  const { settings: app } = useSettings<AppSettings>();
  const muted = !app.enableAudio || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume * 100);
  return useMemo(() => {
    const settings: CkSettings = { ...DEFAULT_CK_SETTINGS, volume, mute: muted };
    return { settings, config: buildCoreConfigIni(settings), volume: muted ? 0 : volume };
  }, [muted, volume]);
};

export { useCoreSettings };
