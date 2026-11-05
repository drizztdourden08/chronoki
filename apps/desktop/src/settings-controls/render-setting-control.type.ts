/* @layer renderer-app @kind types */
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

type ControlProps = { settings: AppSettings; onChange: SettingsPatch<AppSettings> };

export type { ControlProps };
