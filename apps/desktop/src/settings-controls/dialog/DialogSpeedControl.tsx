/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { DIALOG_SPEED_STOPS, nearestStop } from '@chronoki/game-core';
import type { SettingControlProps } from '../settings-controls.type';
import { DIALOG_SPEED_OPTIONS } from './dialog-speed-options.constants';

const DialogSpeedControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(nearestStop(DIALOG_SPEED_STOPS, settings.dialogSpeed))}
    options={DIALOG_SPEED_OPTIONS}
    onChange={(value) => onChange({ dialogSpeed: Number(value) })}
  />
);

export { DialogSpeedControl };
