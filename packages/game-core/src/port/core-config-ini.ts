/* @layer bridge-wasm @kind logic */
import {
  BUTTON_STEMS, DEFAULT_CK_SETTINGS, DEFAULT_KEY2_NAMES, DEFAULT_KEY_NAMES, DEFAULT_PAD_NAMES, INI_HEADER, VANILLA_GAME_FLAGS,
} from './core-config-ini.constants';
import type { CkGameFlags, CkSettings } from './core-config-ini.type';

const flag = (value: boolean): string => (value ? '1' : '0');

const controlLines = (): string[] =>
  BUTTON_STEMS.flatMap((stem, i) => [
    `key_${stem}=${DEFAULT_KEY_NAMES[i]}`,
    `key2_${stem}=${DEFAULT_KEY2_NAMES[i]}`,
    `pad_${stem}=${DEFAULT_PAD_NAMES[i]}`,
  ]);

const tallLine = (s: CkSettings): string[] => (s.tallLines > 0 ? [`tall_lines=${s.tallLines}`] : []);

const wideLine = (s: CkSettings): string[] => (s.widescreen === 'off' ? [] : [`wide_width=${s.wideWidth}`]);

const lockLine = (s: CkSettings): string[] =>
  s.tallLines > 0 || s.widescreen !== 'off' ? [`camera_lock=${flag(s.cameraLock)}`] : [];

const dialogLines = ({ dialogControls, dialogPacing: p }: CkSettings): string[] =>
  dialogControls
    ? ['dialog_controls=1', `dialog_speed_q4=${p.baseQ4}`, `dialog_hold_q4=${p.holdQ4}`, `dialog_hold=${flag(p.hold)}`, `dialog_fill=${flag(p.fill)}`]
    : [];

const chronokiLines = (s: CkSettings, g: CkGameFlags): string[] => {
  const features = s.sightscope || s.visibleTechs ? [`sightscope=${flag(s.sightscope)}`, `visible_techs=${flag(s.visibleTechs)}`] : [];
  const dim = s.dimFlashes ? ['dim_flashes=1'] : [];
  const duplicates = g.randomizer && g.duplicateCharacters === true ? ['duplicate_characters=1'] : [];
  const keys = [...features, ...dim, ...dialogLines(s), ...duplicates];
  return keys.length > 0 ? ['[chronoki]', ...keys, ''] : [];
};

const videoLines = (s: CkSettings): string[] => [
  '[video]',
  'backend=sdl',
  'fullscreen=0',
  'window_scale=2',
  'scale=fit',
  'aspect=pixel',
  'filter=nearest',
  `widescreen=${s.widescreen}`,
  ...wideLine(s),
  ...tallLine(s),
  ...lockLine(s),
  `steam_margins=${flag(s.steamMargins)}`,
  `fill_bottom_lines=${flag(s.fillBottomLines)}`,
  `scene_adjustments=${flag(s.sceneAdjustments)}`,
  `render_scale=${s.renderScale}`,
  `interpolation=${flag(s.interpolation)}`,
  'vsync=1',
  'render_driver=',
  '',
];

const gameLines = (g: CkGameFlags): string[] =>
  g.randomizer ? ['[game]', 'randomizer=1', `disable_glitches=${flag(g.disableGlitches)}`, ''] : [];

const buildCoreConfigIni = (settings: Partial<CkSettings> = {}, game: CkGameFlags = VANILLA_GAME_FLAGS): string => {
  const s = { ...DEFAULT_CK_SETTINGS, ...settings };
  return [
    INI_HEADER,
    '',
    ...videoLines(s),
    ...gameLines(game),
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
    ...chronokiLines(s, game),
  ].join('\n');
};

export { buildCoreConfigIni };
