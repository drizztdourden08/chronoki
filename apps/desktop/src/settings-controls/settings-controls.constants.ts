/* @layer renderer-app @kind constants */
import { isSettingDisabled } from './is-setting-disabled';
import { lockCauseOf } from './lock-cause-of';
import { lockOverlay } from './lock-overlay';
import { renderSettingControl } from './render-setting-control';

const SETTINGS_CONTROLS = {
  renderControl: renderSettingControl,
  isDisabled: isSettingDisabled,
  lockCauseOf,
  lockOverlay,
};

export { SETTINGS_CONTROLS };
