/* @layer renderer-app @kind types */
import type { SettingControlProps } from '../settings-controls.type';
import type { VOLUME_ROWS } from './audio-controls.constants';

type VolumeKey = keyof typeof VOLUME_ROWS;

interface VolumeRowProps extends SettingControlProps {
  settingKey: VolumeKey;
  disabled?: boolean;
}

export type { VolumeKey, VolumeRowProps };
