/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { AUDIO_BUFFER_OPTIONS } from './audio-buffer-options.constants';
import type { SettingControlProps } from '../settings-controls.type';

const AudioBufferControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(settings.audioSamples)}
    options={AUDIO_BUFFER_OPTIONS}
    onChange={(value) => onChange({ audioSamples: Number(value) })}
  />
);

export { AudioBufferControl };
