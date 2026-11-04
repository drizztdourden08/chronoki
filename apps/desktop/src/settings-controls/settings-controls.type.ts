/* @layer renderer-app @kind types */
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

interface SettingControlProps {
  settings: AppSettings;
  onChange: SettingsPatch<AppSettings>;
}

interface GateToggleProps extends SettingControlProps {
  id: string;
}

type RenderScaleControlProps = SettingControlProps;

export type { GateToggleProps, RenderScaleControlProps, SettingControlProps };
