/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setHostGates } from '@chronoki/game-core';
import { setAutoSaveInterval } from '@app/game/auto-save';
import { setTurboVolume } from '@app/game/turbo';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ gates, volume, autoSaveIntervalSeconds }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setTurboVolume(volume); }, [volume]);
};

export { useHostFeatures };
