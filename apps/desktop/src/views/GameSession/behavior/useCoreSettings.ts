/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { buildCoreConfigIni, gateSettings } from '@chronoki/game-core';
import type { CkSettings } from '@chronoki/game-core';
import { resolveGates } from '@chronoki/features';
import { startupFlag } from '@app/launch-flags/startup-flag';
import type { AppSettings } from '@app/settings.type';

const useCoreSettings = (): { settings: CkSettings; config: string; volume: number; gates: ReadonlySet<string> } => {
  const { settings: app } = useSettings<AppSettings>();
  const muted = !app.enableAudio || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume * 100);
  const { original, gates, widescreenAspect, renderScale, steamDataImported } = app;
  return useMemo(() => {
    const satisfied = new Set(steamDataImported ? ['steamData'] : []);
    const { effective } = resolveGates(gates, { vanillaSafe: original, satisfied });
    const settings = gateSettings(effective, { widescreenAspect, renderScale }, { volume, mute: muted });
    return { settings, config: buildCoreConfigIni(settings), volume: muted ? 0 : volume, gates: effective };
  }, [muted, volume, original, gates, widescreenAspect, renderScale, steamDataImported]);
};

export { useCoreSettings };
