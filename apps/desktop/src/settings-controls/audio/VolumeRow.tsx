/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { VolumeControl } from '@drizztdourden08/tessera/composites';
import { VOLUME_ROWS } from './audio-controls.constants';
import type { VolumeRowProps } from './audio.type';
import './VolumeRow.css';

const VolumeRow = ({ settingKey, settings, onChange, disabled }: VolumeRowProps) => {
  const { mutedKey } = VOLUME_ROWS[settingKey];
  return (
    <Box className="volume-row">
      <VolumeControl
        value={settings[settingKey]}
        step={5}
        showValue
        onChange={(value: number) => onChange({ [settingKey]: value })}
        muted={settings[mutedKey]}
        onMutedChange={(muted: boolean) => onChange({ [mutedKey]: muted })}
        disabled={disabled}
      />
    </Box>
  );
};

export { VolumeRow };
