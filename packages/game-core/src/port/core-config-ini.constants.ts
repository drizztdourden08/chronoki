/* @layer bridge-wasm @kind constants */
import type { CkSettings } from './core-config-ini.type';

const DEFAULT_CK_SETTINGS: CkSettings = {
  widescreen: 'off',
  renderScale: 1,
  interpolation: false,
  steamMargins: false,
  fillBottomLines: false,
  sceneAdjustments: false,
  volume: 100,
  mute: false,
  sync: 'frame',
  instantSoundUploads: false,
};

export { DEFAULT_CK_SETTINGS };
