/* @layer bridge-wasm @kind logic */
import {
  BUTTON_STEMS, DEFAULT_CK_SETTINGS, DEFAULT_KEY2_NAMES, DEFAULT_KEY_NAMES, DEFAULT_PAD_NAMES, INI_HEADER,
} from './core-config-ini.constants';
import type { CkSettings } from './core-config-ini.type';

const flag = (value: boolean): string => (value ? '1' : '0');

const controlLines = (): string[] =>
  BUTTON_STEMS.flatMap((stem, i) => [
    `key_${stem}=${DEFAULT_KEY_NAMES[i]}`,
    `key2_${stem}=${DEFAULT_KEY2_NAMES[i]}`,
    `pad_${stem}=${DEFAULT_PAD_NAMES[i]}`,
  ]);

const videoLines = (s: CkSettings): string[] => [
  '[video]',
  'backend=sdl',
  'fullscreen=0',
  'window_scale=2',
  'scale=fit',
  'aspect=pixel',
  'filter=nearest',
  `widescreen=${s.widescreen}`,
  `wide_width=${s.widescreen === 'off' ? 0 : s.wideWidth}`,
  `steam_margins=${flag(s.steamMargins)}`,
  `fill_bottom_lines=${flag(s.fillBottomLines)}`,
  `scene_adjustments=${flag(s.sceneAdjustments)}`,
  `render_scale=${s.renderScale}`,
  `interpolation=${flag(s.interpolation)}`,
  'vsync=1',
  'render_driver=',
  '',
];

const buildCoreConfigIni = (settings: Partial<CkSettings> = {}): string => {
  const s = { ...DEFAULT_CK_SETTINGS, ...settings };
  return [
    INI_HEADER,
    '',
    ...videoLines(s),
    '[sound]',
    `volume=${s.volume}`,
    `mute=${flag(s.mute)}`,
    '',
    '[controls]',
    'pad_stick=1',
    ...controlLines(),
    '',
    '[touch]',
    'virtual_pad=0',
    'opacity=45',
    'size=100',
    '',
    '[timing]',
    `sync=${s.sync}`,
    `instant_sound_uploads=${flag(s.instantSoundUploads)}`,
    '',
  ].join('\n');
};

export { buildCoreConfigIni };
