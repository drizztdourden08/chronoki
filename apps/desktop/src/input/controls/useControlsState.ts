/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { DetectedDevice, FunctionMapping, InputProfile } from '@chronoki/input-mapping';
import { getInputManager } from '../input-manager/get-input-manager';
import { loadInputState } from '../profile-store/load-input-state';
import { useProfileMutations } from './useProfileMutations';
import type { ControlsState } from './controls.type';

const useControlsState = (profileId: string): ControlsState => {
  const [profiles, setProfiles] = useState<InputProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<InputProfile | null>(null);
  const [functionMappings, setFunctionMappings] = useState<FunctionMapping[]>([]);
  const [devices, setDevices] = useState<DetectedDevice[]>([]);

  const sync = useCallback(() => {
    const m = getInputManager();
    setProfiles([...m.profiles]);
    setActiveProfile(m.activeProfile);
    setFunctionMappings([...m.getFunctionMappings()]);
  }, []);

  useEffect(() => {
    const m = getInputManager();
    setDevices(m.getDevices());
    void loadInputState(m, profileId).then(sync);
    const unsubscribeProfile = m.onActiveProfileChange(sync);
    const unsubscribeDevices = m.onDeviceChange(setDevices);
    return () => {
      unsubscribeProfile();
      unsubscribeDevices();
    };
  }, [profileId, sync]);

  const mutations = useProfileMutations({ activeProfile, profiles, functionMappings, sync });

  return { profiles, activeProfile, functionMappings, devices, ...mutations };
};

export { useControlsState };
