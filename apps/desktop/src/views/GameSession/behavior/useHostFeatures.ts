/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setHostGates, setLiveSettings } from '@chronoki/game-core';
import { pushLiveSettings } from '@app/game/live-settings/push-live-settings';
import { setAutoSaveInterval, setAutoSaveMaxEntries } from '@app/game/auto-save';
import { setSaveHoldDuration } from '@app/game/save-overlay';
import { setTurboSpeed, setTurboVolume } from '@app/game/turbo';
import { applyLiveVolume } from '@app/game/turbo/apply-live-volume';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ gates, volume, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  useEffect(() => { setLiveSettings({ dimFlashes: gates.has('dimFlashes') }); pushLiveSettings(); }, [gates]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setAutoSaveMaxEntries(autoSaveMaxEntries); }, [autoSaveMaxEntries]);
  useEffect(() => { setSaveHoldDuration(saveHoldDuration); }, [saveHoldDuration]);
  useEffect(() => { setTurboSpeed(turboSpeed); }, [turboSpeed]);
  useEffect(() => { setTurboVolume(volume); applyLiveVolume(volume); }, [volume]);
};

export { useHostFeatures };
