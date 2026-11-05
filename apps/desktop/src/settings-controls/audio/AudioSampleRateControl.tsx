/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { SAMPLE_RATE_OPTIONS } from './audio-device-options.constants';
import type { SettingControlProps } from '../settings-controls.type';

const AudioSampleRateControl = ({ settings, onChange }: SettingControlProps) => (
  <SegmentedControl
    value={String(settings.audioFreq)}
    options={SAMPLE_RATE_OPTIONS}
    onChange={(value) => onChange({ audioFreq: Number(value) })}
  />
);

export { AudioSampleRateControl };
