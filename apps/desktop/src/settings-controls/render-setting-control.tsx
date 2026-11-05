/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { GateToggle } from './GateToggle';
import { TurboSpeedControl } from './TurboSpeedControl';
import { RenderScaleControl } from './RenderScaleControl';
import { VolumeRow } from './audio/VolumeRow';
import { DetectedPackControl } from './detected-pack-control';
import { DialogHoldSpeedControl } from './dialog/DialogHoldSpeedControl';
import { DialogSpeedControl } from './dialog/DialogSpeedControl';
import { AspectRatioRow } from './display/AspectRatioRow';
import { withAspectCascade } from './display/with-aspect-cascade';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

type ControlProps = { settings: AppSettings; onChange: SettingsPatch<AppSettings> };

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

const renderSettingControl = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null => {
  if (key.startsWith(GATE_KEY_PREFIX)) {
    const cascaded: SettingsPatch<AppSettings> = (patch) => onChange(withAspectCascade(patch, settings));
    return <GateToggle id={key.slice(GATE_KEY_PREFIX.length)} settings={settings} onChange={cascaded} />;
  }
  return CONTROL_OF_KEY[key]?.(key, { settings, onChange }) ?? null;
};

export { renderSettingControl };
