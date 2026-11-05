/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setHostGates } from '@chronoki/game-core';
import { setAutoSaveInterval, setAutoSaveMaxEntries } from '@app/game/auto-save';
import { setTurboSpeed, setTurboVolume } from '@app/game/turbo';
import { applyLiveVolume } from '@app/game/turbo/apply-live-volume';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ gates, volume, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setAutoSaveMaxEntries(autoSaveMaxEntries); }, [autoSaveMaxEntries]);
  useEffect(() => { setTurboSpeed(turboSpeed); }, [turboSpeed]);
  useEffect(() => { setTurboVolume(volume); applyLiveVolume(volume); }, [volume]);
};

export { useHostFeatures };
