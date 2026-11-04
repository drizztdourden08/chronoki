/* @layer shared-storage @kind constants */
import { DEFAULT_GATES } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';
import type { ProfilePresetId } from './profile-presets.type';

const VANILLA_CONFIG_OVERRIDES: Partial<AppSettings> = {
  vanillaSafe: true,
};

const ENHANCED_EXTRA_GATES: readonly string[] = ['autoSave', 'widescreen', 'sceneAdjust', 'wideSteamMargins', 'fillBottomLine', 'renderScale', 'interpolate'];

const ENHANCED_CONFIG_OVERRIDES: Partial<AppSettings> = {
  vanillaSafe: false,
  gates: [...DEFAULT_GATES, ...ENHANCED_EXTRA_GATES.filter((id) => !DEFAULT_GATES.includes(id))],
  showFps: true,
  pixelPerfect: true,
  saveHoldDuration: 1,
};

const DEFAULT_PROFILE_PRESET: ProfilePresetId = 'enhanced';

const PRESET_OPTIONS: { value: ProfilePresetId; label: string }[] = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'enhanced', label: 'Enhanced' },
];

const PRESET_HINTS: Readonly<Record<ProfilePresetId, string>> = {
  vanilla: 'The game as it shipped: Vanilla Safe on.',
  enhanced: 'The game with ChronoKi changes switched on.',
};

export { DEFAULT_PROFILE_PRESET, ENHANCED_CONFIG_OVERRIDES, PRESET_HINTS, PRESET_OPTIONS, VANILLA_CONFIG_OVERRIDES };
