/* @layer renderer-components @kind constants */
import type { SettingFormat, SettingsSection } from './settings-sections.type';

const capitalized: SettingFormat = (value) => {
  const text = typeof value === 'string' && value !== '' ? value : 'default';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const times: SettingFormat = (value) => (typeof value === 'number' ? `${value}x` : 'Default');

const seconds: SettingFormat = (value) => (typeof value === 'number' ? `${value} s` : 'Default');

const count: SettingFormat = (value) => (Array.isArray(value) ? String(value.length) : '0');

const PICTURE_SECTION: SettingsSection = {
  title: 'Picture',
  keys: [
    { key: 'widescreenAspect', label: 'Widescreen aspect' },
    { key: 'renderScale', label: 'Render scale', format: times },
  ],
};

const WINDOW_SECTION: SettingsSection = {
  title: 'Window',
  keys: [
    { key: 'windowMode', label: 'Window mode', format: capitalized },
    { key: 'startFullscreen', label: 'Start fullscreen' },
    { key: 'showFps', label: 'Show FPS' },
    { key: 'viewportConstraint', label: 'Viewport', format: capitalized },
    { key: 'pixelPerfect', label: 'Pixel Perfect' },
  ],
};

const AUDIO_SECTION: SettingsSection = {
  title: 'Audio',
  keys: [
    { key: 'enableAudio', label: 'Audio' },
    { key: 'masterVolume', label: 'Master volume' },
    { key: 'masterMuted', label: 'Muted' },
  ],
};

const GAMEPLAY_SECTION: SettingsSection = {
  title: 'Gameplay',
  keys: [
    { key: 'original', label: 'Original mode' },
    { key: 'autoSaveIntervalSeconds', label: 'Auto-save interval', format: seconds },
    { key: 'autoSaveMaxEntries', label: 'Max auto-save entries' },
    { key: 'turboSpeed', label: 'Turbo speed', format: times },
  ],
};

const ENHANCEMENTS_SECTION: SettingsSection = {
  title: 'Enhancements',
  keys: [{ key: 'gates', label: 'Enhancements on', format: count }],
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  PICTURE_SECTION,
  WINDOW_SECTION,
  AUDIO_SECTION,
  GAMEPLAY_SECTION,
  ENHANCEMENTS_SECTION,
];

export { SETTINGS_SECTIONS };
