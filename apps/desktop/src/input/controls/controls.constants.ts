/* @layer renderer-components @kind constants */
import type { FunctionAction, SnesButton } from '@chronoki/input-mapping';
import { publicAsset } from '@app/input/button-icons/public-asset';

const MODIFIER_CODES = new Set([
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
]);

const CANCEL_ARM_DELAY_MS = 150;
const LISTEN_ARM_DELAY_MS = 200;

const CONTROLS_TABS = [
  { id: 'controls', label: 'Game Controls' },
  { id: 'shortcuts', label: 'Shortcuts & Functions' },
  { id: 'options', label: 'Options' },
];

const SIDE_PANEL_SIZE = { width: 192, minWidth: 160, maxWidth: 360 };

const SHORTCUT_ACTIONS: readonly FunctionAction[] = [
  'save-state-1', 'save-state-2', 'save-state-3', 'save-state-4',
  'save-state-5', 'save-state-6', 'save-state-7', 'save-state-8',
  'save-state-9', 'save-state-10', 'save-state-11', 'save-state-12',
  'load-state-1', 'load-state-2', 'load-state-3', 'load-state-4',
  'load-state-5', 'load-state-6', 'load-state-7', 'load-state-8',
  'load-state-9', 'load-state-10', 'load-state-11', 'load-state-12',
  'save-state', 'load-state', 'slot-next', 'slot-prev',
  'pause', 'reset',
  'fullscreen', 'turbo',
  'profile-next', 'profile-prev',
  'toggle-debug-capture', 'screenshot',
];

const SNES_ACTION_LABELS: Record<SnesButton, string> = {
  A: 'Confirm / Talk', B: 'Cancel / Run', X: 'Menu', Y: 'Y Button', L: 'L Button', R: 'R Button',
  Start: 'Start Button', Select: 'Select Button',
  Up: 'Move Up', Down: 'Move Down', Left: 'Move Left', Right: 'Move Right',
};

const NARROW_CONTAINER_WIDTH = 640;
const PROFILES_FOLD_KEY = 'controls.profiles.collapsed';
const DEVICES_FOLD_KEY = 'controls.devices.collapsed';
const PROFILES_DEFAULT_FOLDED = true;

const SNES_ICON_IDS: Record<SnesButton, string> = {
  A: 'snes-a', B: 'snes-b', X: 'snes-x', Y: 'snes-y', L: 'snes-l', R: 'snes-r',
  Start: 'snes-start', Select: 'snes-select',
  Up: 'snes-dup', Down: 'snes-ddown', Left: 'snes-dleft', Right: 'snes-dright',
};

const GENERIC_DEVICE_ICON = publicAsset('buttons/generic/generic_joystick.svg');
const KEYBOARD_DEVICE_ICON = publicAsset('buttons/keyboard/keyboard.svg');

const DEVICE_FAMILY_ICON: Record<string, string> = {
  xbox: publicAsset('buttons/xbox/controller_xboxseries.svg'),
  playstation: publicAsset('buttons/playstation/controller_playstation5.svg'),
  nintendo: publicAsset('buttons/switch/controller_switch_pro.svg'),
};

const SDL_TYPE_ICON: Record<string, string> = {
  gamecube: publicAsset('buttons/gc/controller_gamecube.svg'),
};

export {
  CANCEL_ARM_DELAY_MS, CONTROLS_TABS, DEVICE_FAMILY_ICON, GENERIC_DEVICE_ICON, KEYBOARD_DEVICE_ICON,
  DEVICES_FOLD_KEY, LISTEN_ARM_DELAY_MS, MODIFIER_CODES, NARROW_CONTAINER_WIDTH, PROFILES_DEFAULT_FOLDED, PROFILES_FOLD_KEY, SDL_TYPE_ICON, SHORTCUT_ACTIONS,
  SIDE_PANEL_SIZE, SNES_ACTION_LABELS, SNES_ICON_IDS,
};
