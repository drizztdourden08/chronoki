/* @layer renderer-components @kind data */
import { BUTTON_ICON_PATHS as CONTROLLER_ICON_PATHS } from './button-icon-paths.constants';
import { KEYBOARD_ICON_PATHS } from './keyboard-icon-paths.constants';

const BUTTON_ICON_PATHS: Record<string, string> = { ...CONTROLLER_ICON_PATHS, ...KEYBOARD_ICON_PATHS };

export { BUTTON_ICON_PATHS };
