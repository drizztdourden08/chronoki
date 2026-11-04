/* @layer renderer-components @kind logic */
import { useCallback, useState } from 'react';
import type { DevicePreset } from '../profile-edit/profile-edit.type';
import type { ControlsState } from './controls.type';

const usePresetConfirm = (ctrl: ControlsState) => {
  const [presetTarget, setPresetTarget] = useState<DevicePreset | null>(null);
  const cancelPreset = useCallback(() => setPresetTarget(null), []);
  const confirmPreset = useCallback(() => {
    if (presetTarget) ctrl.applyToActive(presetTarget);
    setPresetTarget(null);
  }, [ctrl, presetTarget]);
  return { presetTarget, setPresetTarget, cancelPreset, confirmPreset };
};

export { usePresetConfirm };
