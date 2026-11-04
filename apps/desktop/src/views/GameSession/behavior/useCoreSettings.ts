/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { aspectRatioOf, buildCoreConfigIni, gateSettings } from '@chronoki/game-core';
import type { CkArea } from '@chronoki/game-core';
import { resolveGates } from '@chronoki/features';
import { useLegacyModeMigration } from '@app/profiles/useLegacyModeMigration';
import { isPackaged } from '@app/launch-flags/is-packaged';
import { startupFlag } from '@app/launch-flags/startup-flag';
import { steamSatisfied } from '@app/settings-controls/steam-satisfied';
import { useSteamDataImported } from '@app/settings-controls/useSteamDataImported';
import { useVolumeScaleMigration } from '@app/settings-controls/useVolumeScaleMigration';
import { useWindowModeReset } from '@app/settings-controls/useWindowModeReset';
import type { AppSettings } from '@app/settings.type';
import { displayInputsOf } from './display-inputs-of';
import type { CoreSettings } from './useCoreSettings.type';

const useCoreSettings = (stageArea: CkArea | null): CoreSettings => {
  const { settings: app } = useSettings<AppSettings>();
  useVolumeScaleMigration();
  useLegacyModeMigration();
  useWindowModeReset();
  const steamData = useSteamDataImported();
  const muted = app.masterMuted || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume);
  const { vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration } = app;
  const { screenRatio, stageArea: planned, wholePixels } = displayInputsOf(app, stageArea);
  const areaW = planned?.width ?? 0;
  const areaH = planned?.height ?? 0;
  return useMemo(() => {
    const satisfied = steamSatisfied(steamData);
    const { effective } = resolveGates(gates, { vanillaSafe, packaged: isPackaged(), satisfied });
    const stage = areaW > 0 ? { width: areaW, height: areaH } : undefined;
    const options = { aspectRatio, customAspectW, customAspectH, renderScale, screenRatio, stageArea: stage, wholePixels };
    const settings = gateSettings(effective, options, { volume, mute: muted });
    return {
      settings,
      config: buildCoreConfigIni(settings),
      volume: muted ? 0 : volume,
      gates: effective,
      pictureRatio: aspectRatioOf(effective, options),
      autoSaveIntervalSeconds,
      autoSaveMaxEntries,
      turboSpeed,
      saveHoldDuration,
    };
  }, [muted, volume, vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, screenRatio, areaW, areaH, wholePixels, steamData, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration]);
};

export { useCoreSettings };
