/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { GateToggle } from './GateToggle';
import { TurboSpeedControl } from './TurboSpeedControl';
import { RenderScaleControl } from './RenderScaleControl';
import { VolumeRow } from './audio/VolumeRow';
import { DetectedPackSummary } from './audio/DetectedPackSummary';
import { openProfilesPage } from './audio/open-profiles-page';
import { AspectRatioRow } from './display/AspectRatioRow';
import { withAspectCascade } from './display/with-aspect-cascade';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

const renderSettingControl = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null => {
  if (key.startsWith(GATE_KEY_PREFIX)) {
    const cascaded: SettingsPatch<AppSettings> = (patch) => onChange(withAspectCascade(patch, settings));
    return <GateToggle id={key.slice(GATE_KEY_PREFIX.length)} settings={settings} onChange={cascaded} />;
  }
  if (key === 'aspectRatio') return <AspectRatioRow settings={settings} onChange={onChange} />;
  if (key === 'renderScale') return <RenderScaleControl settings={settings} onChange={onChange} />;
  if (key === 'turboSpeed') return <TurboSpeedControl settings={settings} onChange={onChange} />;
  if (key === 'masterVolume') return <VolumeRow settingKey="masterVolume" settings={settings} onChange={onChange} />;
  if (key === 'musicVolume' || key === 'sfxVolume') return <VolumeRow settingKey={key} settings={settings} onChange={onChange} />;
  if (key === 'detectedPack') return <DetectedPackSummary pack={null} onOpenProfiles={openProfilesPage} />;
  return null;
};

export { renderSettingControl };
