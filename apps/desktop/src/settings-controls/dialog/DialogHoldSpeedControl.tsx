/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { DIALOG_HOLD_STOPS, nearestStop } from '@chronoki/game-core';
import type { SettingControlProps } from '../settings-controls.type';
import { DIALOG_HOLD_SPEED_OPTIONS } from './dialog-speed-options.constants';

const DialogHoldSpeedControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(nearestStop(DIALOG_HOLD_STOPS, settings.dialogHoldSpeed))}
    options={DIALOG_HOLD_SPEED_OPTIONS}
    onChange={(value) => onChange({ dialogHoldSpeed: Number(value) })}
  />
);

export { DialogHoldSpeedControl };
