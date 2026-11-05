/* @layer renderer-app @kind data */
import type { ReactNode } from 'react';
import { TurboSpeedControl } from './TurboSpeedControl';
import { RenderScaleControl } from './RenderScaleControl';
import { VolumeRow } from './audio/VolumeRow';
import { DetectedPackControl } from './detected-pack-control';
import { DialogHoldSpeedControl } from './dialog/DialogHoldSpeedControl';
import { DialogSpeedControl } from './dialog/DialogSpeedControl';
import { AspectRatioRow } from './display/AspectRatioRow';
import type { ControlProps } from './render-setting-control.type';

const CONTROL_OF_KEY: Record<string, (key: string, props: ControlProps) => ReactNode> = {
  aspectRatio: (_key, props) => <AspectRatioRow {...props} />,
  renderScale: (_key, props) => <RenderScaleControl {...props} />,
  turboSpeed: (_key, props) => <TurboSpeedControl {...props} />,
  dialogSpeed: (_key, props) => <DialogSpeedControl {...props} />,
  dialogHoldSpeed: (_key, props) => <DialogHoldSpeedControl {...props} />,
  masterVolume: (_key, props) => <VolumeRow settingKey="masterVolume" {...props} />,
  musicVolume: (key, props) => <VolumeRow settingKey={key as 'musicVolume'} {...props} />,
  sfxVolume: (key, props) => <VolumeRow settingKey={key as 'sfxVolume'} {...props} />,
  detectedPack: () => <DetectedPackControl />,
};

export { CONTROL_OF_KEY };
