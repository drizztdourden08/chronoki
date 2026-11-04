/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { AUTO_SAVE_INTERVAL_OPTIONS } from './auto-save-interval-options.constants';
import type { SettingControlProps } from './settings-controls.type';

const AutoSaveIntervalControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(settings.autoSaveIntervalSeconds)}
    options={AUTO_SAVE_INTERVAL_OPTIONS}
    onChange={(value) => onChange({ autoSaveIntervalSeconds: Number(value) })}
  />
);

export { AutoSaveIntervalControl };
