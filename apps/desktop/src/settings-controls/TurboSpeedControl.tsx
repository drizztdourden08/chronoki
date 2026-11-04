/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { nearestTurboSpeed } from '@app/game/turbo/nearest-turbo-speed';
import { TURBO_SPEED_OPTIONS } from './turbo-speed-options.constants';
import type { SettingControlProps } from './settings-controls.type';

const TurboSpeedControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(nearestTurboSpeed(settings.turboSpeed))}
    options={TURBO_SPEED_OPTIONS}
    onChange={(value) => onChange({ turboSpeed: Number(value) })}
  />
);

export { TurboSpeedControl };
