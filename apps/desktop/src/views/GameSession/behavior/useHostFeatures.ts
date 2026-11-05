/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setHostGates, setLiveSettings } from '@chronoki/game-core';
import { pushLiveSettings } from '@app/game/live-settings/push-live-settings';
import { setAutoSaveInterval, setAutoSaveMaxEntries } from '@app/game/auto-save';
import { setSaveHoldDuration } from '@app/game/save-overlay';
import { setTurboSpeed, setTurboVolume } from '@app/game/turbo';
import { applyLiveVolume } from '@app/game/turbo/apply-live-volume';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ settings, gates, volume, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  const { baseQ4, holdQ4, hold, fill } = settings.dialogPacing;
  useEffect(() => {
    setLiveSettings({ dimFlashes: gates.has('dimFlashes'), dialogPacing: { baseQ4, holdQ4, hold, fill } });
    pushLiveSettings();
  }, [gates, baseQ4, holdQ4, hold, fill]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setAutoSaveMaxEntries(autoSaveMaxEntries); }, [autoSaveMaxEntries]);
  useEffect(() => { setSaveHoldDuration(saveHoldDuration); }, [saveHoldDuration]);
  useEffect(() => { setTurboSpeed(turboSpeed); }, [turboSpeed]);
  useEffect(() => { setTurboVolume(volume); applyLiveVolume(volume); }, [volume]);
};

export { useHostFeatures };
