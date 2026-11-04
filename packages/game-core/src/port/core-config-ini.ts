/* @layer bridge-wasm @kind logic */
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

const flag = (value: boolean): string => (value ? '1' : '0');

const buildCoreConfigIni = (settings: Partial<CkSettings> = {}): string => {
  const s = { ...DEFAULT_CK_SETTINGS, ...settings };
  return [
    '[video]',
    `widescreen = ${s.widescreen}`,
    `render_scale = ${s.renderScale}`,
    `interpolation = ${flag(s.interpolation)}`,
    `steam_margins = ${flag(s.steamMargins)}`,
    `fill_bottom_lines = ${flag(s.fillBottomLines)}`,
    `scene_adjustments = ${flag(s.sceneAdjustments)}`,
    '',
    '[sound]',
    `volume = ${s.volume}`,
    `mute = ${flag(s.mute)}`,
    '',
    '[timing]',
    `sync = ${s.sync}`,
    `instant_sound_uploads = ${flag(s.instantSoundUploads)}`,
    '',
  ].join('\n');
};

export { buildCoreConfigIni, DEFAULT_CK_SETTINGS };
