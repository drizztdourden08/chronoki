/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { bindDeveloperTools } from '@drizztdourden08/brock-react';
import { hostGate, onHostGatesChange, setHostGates } from '@chronoki/game-core';
import { setAutoSaveInterval } from '@app/game/auto-save';
import { setTurboVolume } from '@app/game/turbo';
import { DEVELOPER_TOOLS_GATE } from '../GameSession.constants';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ gates, volume, autoSaveIntervalSeconds }: ReturnType<typeof useCoreSettings>): void => {
  useEffect(() => { setHostGates(gates); }, [gates]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setTurboVolume(volume); }, [volume]);
  useEffect(() => bindDeveloperTools({
    get: () => hostGate(DEVELOPER_TOOLS_GATE),
    set: () => undefined,
    subscribe: onHostGatesChange,
  }), []);
};

export { useHostFeatures };
