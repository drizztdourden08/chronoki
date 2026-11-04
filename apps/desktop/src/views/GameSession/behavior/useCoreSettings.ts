/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { buildCoreConfigIni, gateSettings } from '@chronoki/game-core';
import { resolveGates } from '@chronoki/features';
import { useLegacyModeMigration } from '@app/profiles/useLegacyModeMigration';
import { isPackaged } from '@app/launch-flags/is-packaged';
import { startupFlag } from '@app/launch-flags/startup-flag';
import { useVolumeScaleMigration } from '@app/settings-controls/useVolumeScaleMigration';
import { useWindowModeReset } from '@app/settings-controls/useWindowModeReset';
import type { AppSettings } from '@app/settings.type';
import type { CoreSettings } from './useCoreSettings.type';

const useCoreSettings = (): CoreSettings => {
  const { settings: app } = useSettings<AppSettings>();
  useVolumeScaleMigration();
  useLegacyModeMigration();
  useWindowModeReset();
  const muted = app.masterMuted || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume);
  const { vanillaSafe, gates, widescreenAspect, renderScale, steamDataImported, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration } = app;
  return useMemo(() => {
    const satisfied = new Set(steamDataImported ? ['steamData'] : []);
    const { effective } = resolveGates(gates, { vanillaSafe, packaged: isPackaged(), satisfied });
    const settings = gateSettings(effective, { widescreenAspect, renderScale }, { volume, mute: muted });
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
  }, [muted, volume, vanillaSafe, gates, widescreenAspect, renderScale, steamDataImported, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration]);
};

export { useCoreSettings };
