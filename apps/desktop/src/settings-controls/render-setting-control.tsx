/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { GateToggle } from './GateToggle';
import { withAspectCascade } from './display/with-aspect-cascade';
import { GATE_KEY_PREFIX } from './gate-keys.constants';
import { CONTROL_OF_KEY } from './render-setting-control.constants';

const renderSettingControl = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null => {
  if (key.startsWith(GATE_KEY_PREFIX)) {
    const cascaded: SettingsPatch<AppSettings> = (patch) => onChange(withAspectCascade(patch, settings));
    return <GateToggle id={key.slice(GATE_KEY_PREFIX.length)} settings={settings} onChange={cascaded} />;
  }
  return CONTROL_OF_KEY[key]?.(key, { settings, onChange }) ?? null;
};

export { renderSettingControl };
