/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { buildCoreConfigIni, gateSettings } from '@chronoki/game-core';
import type { CkSettings } from '@chronoki/game-core';
import { resolveGates } from '@chronoki/features';
import { isPackaged } from '@app/launch-flags/is-packaged';
import { startupFlag } from '@app/launch-flags/startup-flag';
import type { AppSettings } from '@app/settings.type';

interface CoreSettings {
  settings: CkSettings;
  config: string;
  volume: number;
  gates: ReadonlySet<string>;
  autoSaveIntervalSeconds: number;
  autoSaveMaxEntries: number;
  turboSpeed: number;
}

const useCoreSettings = (): CoreSettings => {
  const { settings: app } = useSettings<AppSettings>();
  const muted = !app.enableAudio || app.masterMuted || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume * 100);
  const { original, gates, widescreenAspect, renderScale, steamDataImported, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed } = app;
  return useMemo(() => {
    const satisfied = new Set(steamDataImported ? ['steamData'] : []);
    const { effective } = resolveGates(gates, { vanillaSafe: original, packaged: isPackaged(), satisfied });
    const settings = gateSettings(effective, { widescreenAspect, renderScale }, { volume, mute: muted });
    return {
      settings,
      config: buildCoreConfigIni(settings),
      volume: muted ? 0 : volume,
      gates: effective,
      autoSaveIntervalSeconds,
      autoSaveMaxEntries,
      turboSpeed,
    };
  }, [muted, volume, original, gates, widescreenAspect, renderScale, steamDataImported, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed]);
};

export { useCoreSettings };
