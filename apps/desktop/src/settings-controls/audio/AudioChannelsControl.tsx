/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { CHANNEL_OPTIONS } from './audio-device-options.constants';
import type { SettingControlProps } from '../settings-controls.type';

const AudioChannelsControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(settings.audioChannels)}
    options={CHANNEL_OPTIONS}
    onChange={(value) => onChange({ audioChannels: Number(value) })}
  />
);

export { AudioChannelsControl };
