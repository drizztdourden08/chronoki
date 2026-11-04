/* @layer bridge-wasm @kind constants */
import type { CkSettings } from './core-config-ini.type';

const DEFAULT_CK_SETTINGS: CkSettings = {
  widescreen: 'off',
  wideWidth: 0,
  tallLines: 0,
  renderScale: 1,
  interpolation: false,
  steamMargins: false,
  fillBottomLines: false,
  sceneAdjustments: false,
  volume: 100,
  mute: false,
  sync: 'frame_perfect',
  instantSoundUploads: false,
};

const INI_HEADER = '; Belthasar -- options. Edited by the F1 overlay; safe to edit by hand.';

const BUTTON_STEMS = ['up', 'down', 'left', 'right', 'a', 'b', 'x', 'y', 'l', 'r', 'select', 'start'] as const;

const DEFAULT_KEY_NAMES = ['Up', 'Down', 'Left', 'Right', 'Z', 'X', 'A', 'S', 'D', 'C', 'Backspace', 'Return'];

const DEFAULT_KEY2_NAMES = ['', '', '', '', '', '', '', '', '', '', '', 'Keypad Enter'];

const DEFAULT_PAD_NAMES = [
  'dpup', 'dpdown', 'dpleft', 'dpright', 'b', 'a', 'y', 'x', 'leftshoulder', 'rightshoulder', 'back', 'start',
];

export {
  BUTTON_STEMS, DEFAULT_CK_SETTINGS, DEFAULT_KEY2_NAMES, DEFAULT_KEY_NAMES, DEFAULT_PAD_NAMES, INI_HEADER,
};
