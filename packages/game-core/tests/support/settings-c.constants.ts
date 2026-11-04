/* @layer tests @kind test-support */
const KEY_FIELDS: Record<string, string> = {
  fullscreen: 'fullscreen',
  window_scale: 'windowScale',
  render_scale: 'renderScale',
  interpolation: 'interpolate',
  steam_margins: 'wideSteamMargins',
  fill_bottom_lines: 'fillBottomLines',
  scene_adjustments: 'sceneAdjust',
  vsync: 'vsync',
  volume: 'volume',
  mute: 'mute',
  pad_stick: 'padStick',
  virtual_pad: 'touchPad',
  opacity: 'touchOpacity',
  size: 'touchScale',
  instant_sound_uploads: 'instantUploads',
};

const ENUM_DEFAULTS: Record<string, string> = {
  backend: 'sdl',
  scale: 'fit',
  aspect: 'pixel',
  filter: 'nearest',
  widescreen: 'off',
  sync: 'frame_perfect',
  render_driver: '',
};

const ENUM_DEFAULT_SOURCES: RegExp[] = [
  /s->backend = 0/,
  /s->scaleMode = CT_SCALE_FIT/,
  /s->aspect = CT_ASPECT_PIXEL/,
  /s->linearFilter = 0/,
  /s->sync = CT_SYNC_FRAME_PERFECT/,
  /s->renderDriver\[0\] = 0/,
];

const SCANCODE_NAMES: Record<string, string> = {
  UP: 'Up',
  DOWN: 'Down',
  LEFT: 'Left',
  RIGHT: 'Right',
  BACKSPACE: 'Backspace',
  RETURN: 'Return',
  KP_ENTER: 'Keypad Enter',
};

const PAD_NAMES: Record<string, string> = {
  DPAD_UP: 'dpup',
  DPAD_DOWN: 'dpdown',
  DPAD_LEFT: 'dpleft',
  DPAD_RIGHT: 'dpright',
  LEFTSHOULDER: 'leftshoulder',
  RIGHTSHOULDER: 'rightshoulder',
  BACK: 'back',
  START: 'start',
  A: 'a',
  B: 'b',
  X: 'x',
  Y: 'y',
};

export { ENUM_DEFAULTS, ENUM_DEFAULT_SOURCES, KEY_FIELDS, PAD_NAMES, SCANCODE_NAMES };
