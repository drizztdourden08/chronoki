/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { AutoSaveIntervalControl } from './AutoSaveIntervalControl';
import { GateToggle } from './GateToggle';
import { RenderScaleControl } from './RenderScaleControl';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

const renderSettingControl = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null => {
  if (key.startsWith(GATE_KEY_PREFIX)) {
    return <GateToggle id={key.slice(GATE_KEY_PREFIX.length)} settings={settings} onChange={onChange} />;
  }
  if (key === 'renderScale') return <RenderScaleControl settings={settings} onChange={onChange} />;
  if (key === 'autoSaveIntervalSeconds') return <AutoSaveIntervalControl settings={settings} onChange={onChange} />;
  return null;
};

export { renderSettingControl };
