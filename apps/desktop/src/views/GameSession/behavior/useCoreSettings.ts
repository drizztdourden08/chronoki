/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { aspectRatioValue } from '@drizztdourden08/brock-display/aspect-ratio';
import { buildCoreConfigIni, gateSettings } from '@chronoki/game-core';
import { resolveGates } from '@chronoki/features';
import { useLegacyModeMigration } from '@app/profiles/useLegacyModeMigration';
import { isPackaged } from '@app/launch-flags/is-packaged';
import { startupFlag } from '@app/launch-flags/startup-flag';
import { ASPECT_LIMITS } from '@app/settings-controls/display/display.constants';
import { steamSatisfied } from '@app/settings-controls/steam-satisfied';
import { useSteamDataImported } from '@app/settings-controls/useSteamDataImported';
import { useVolumeScaleMigration } from '@app/settings-controls/useVolumeScaleMigration';
import { useWindowModeReset } from '@app/settings-controls/useWindowModeReset';
import type { AppSettings } from '@app/settings.type';
import type { CoreSettings } from './useCoreSettings.type';

const useCoreSettings = (): CoreSettings => {
  const { settings: app } = useSettings<AppSettings>();
  useVolumeScaleMigration();
  useLegacyModeMigration();
  useWindowModeReset();
  const steamData = useSteamDataImported();
  const muted = app.masterMuted || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume);
  const { vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration } = app;
  const screenRatio = useMemo(
    () => aspectRatioValue(aspectRatio === 'auto' ? 'auto' : 'screen', { customW: customAspectW, customH: customAspectH, limits: ASPECT_LIMITS, letterbox: true }),
    [aspectRatio, customAspectW, customAspectH],
  );
  return useMemo(() => {
    const satisfied = steamSatisfied(steamData);
    const { effective } = resolveGates(gates, { vanillaSafe, packaged: isPackaged(), satisfied });
    const settings = gateSettings(effective, { aspectRatio, customAspectW, customAspectH, renderScale, screenRatio }, { volume, mute: muted });
    return {
      settings,
      config: buildCoreConfigIni(settings),
      volume: muted ? 0 : volume,
      gates: effective,
      autoSaveIntervalSeconds,
      autoSaveMaxEntries,
      turboSpeed,
      saveHoldDuration,
    };
  }, [muted, volume, vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, screenRatio, steamData, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration]);
};

export { useCoreSettings };
