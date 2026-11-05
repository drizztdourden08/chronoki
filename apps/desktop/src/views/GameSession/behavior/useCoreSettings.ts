/* @layer renderer-appshell @kind hook */
import { useMemo } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { useSettings } from '@drizztdourden08/brock-react';
import { gameFlagsOf } from '@app/game/randomizer/game-flags-of';
import { buildCoreConfigIni, dialogPacingOf, gateSettings, pictureRatioOf } from '@chronoki/game-core';
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
import { disableGlitchesOf } from './disable-glitches-of';
import { displayInputsOf } from './display-inputs-of';
import { duplicateCharactersOf } from './duplicate-characters-of';
import type { CoreSettings } from './useCoreSettings.type';

const useCoreSettings = (stageArea: CkArea | null, profile: Profile | null = null): CoreSettings => {
  const { settings: app } = useSettings<AppSettings>();
  useVolumeScaleMigration();
  useLegacyModeMigration();
  useWindowModeReset();
  const steamData = useSteamDataImported();
  const muted = app.masterMuted || startupFlag('muted') === true;
  const volume = Math.round(app.masterVolume);
  const { dialogSpeed, dialogHoldSpeed, dialogHoldToAccelerate, dialogFillOnB, dialogAutoSkip } = app;
  const { vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration } = app;
  const { screenRatio, stageArea: planned, wholePixels } = displayInputsOf(app, stageArea);
  const areaW = planned?.width ?? 0;
  const areaH = planned?.height ?? 0;
  const randomizer = profile?.randomizer !== undefined;
  const disableGlitches = disableGlitchesOf(profile);
  const duplicateCharacters = duplicateCharactersOf(profile);
  return useMemo(() => {
    const satisfied = steamSatisfied(steamData);
    const { effective } = resolveGates(gates, { vanillaSafe, packaged: isPackaged(), satisfied });
    const stage = areaW > 0 ? { width: areaW, height: areaH } : undefined;
    const options = { aspectRatio, customAspectW, customAspectH, renderScale, screenRatio, stageArea: stage, wholePixels };
    const dialog = dialogPacingOf({ dialogSpeed, dialogHoldSpeed, dialogHoldToAccelerate, dialogFillOnB, dialogAutoSkip });
    const settings = gateSettings(effective, options, { volume, mute: muted }, dialog);
    return {
      settings,
      config: buildCoreConfigIni(settings, gameFlagsOf(randomizer, disableGlitches, duplicateCharacters)),
      volume: muted ? 0 : volume,
      gates: effective,
      pictureRatio: pictureRatioOf(effective, options),
      autoSaveIntervalSeconds,
      autoSaveMaxEntries,
      turboSpeed,
      saveHoldDuration,
    };
  }, [muted, volume, vanillaSafe, gates, aspectRatio, customAspectW, customAspectH, renderScale, screenRatio, areaW, areaH, wholePixels, steamData, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration, randomizer, disableGlitches, duplicateCharacters,
    dialogSpeed, dialogHoldSpeed, dialogHoldToAccelerate, dialogFillOnB, dialogAutoSkip]);
};

export { useCoreSettings };
