/* @layer renderer-app @kind constants */
import { volumeFromSettings } from '@drizztdourden08/brock-react';
import { SETTINGS_CONTROLS } from './settings-controls/settings-controls.constants';
import { DEFAULT_SETTINGS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, ...SETTINGS_CONTROLS };

const VOLUME = volumeFromSettings({ value: 'masterVolume', muted: 'masterMuted', max: 1 });

export { SETTINGS, VOLUME };
