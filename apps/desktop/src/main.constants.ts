/* @layer renderer-app @kind constants */
import { SETTINGS_CONTROLS } from './settings-controls/settings-controls.constants';
import { DEFAULT_SETTINGS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, ...SETTINGS_CONTROLS };

export { SETTINGS };
