/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setHostGates } from '@chronoki/game-core';
import { setAutoSaveInterval, setAutoSaveMaxEntries } from '@app/game/auto-save';
import { setSaveHoldDuration } from '@app/game/save-overlay';
import { setTurboSpeed, setTurboVolume } from '@app/game/turbo';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ gates, volume, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed, saveHoldDuration }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setAutoSaveMaxEntries(autoSaveMaxEntries); }, [autoSaveMaxEntries]);
  useEffect(() => { setSaveHoldDuration(saveHoldDuration); }, [saveHoldDuration]);
  useEffect(() => { setTurboSpeed(turboSpeed); }, [turboSpeed]);
  useEffect(() => { setTurboVolume(volume); }, [volume]);
};

export { useHostFeatures };
