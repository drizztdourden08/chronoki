/* @layer renderer-components @kind constants */
import type { SettingFormat, SettingsSection } from './settings-sections.type';

const VIEWPORT_LABELS: Readonly<Record<string, string>> = { none: 'Letterbox', fit: 'Fit Window', fill: 'Stretch' };

const viewport: SettingFormat = (value) => (typeof value === 'string' ? (VIEWPORT_LABELS[value] ?? value) : 'Default');

const percent: SettingFormat = (value) => (typeof value === 'number' ? `${Math.round(value <= 1 ? value * 100 : value)}%` : 'Default');

const times: SettingFormat = (value) => (typeof value === 'number' ? `${value}x` : 'Default');

const seconds: SettingFormat = (value) => (typeof value === 'number' ? `${value} s` : 'Default');

const count: SettingFormat = (value) => (Array.isArray(value) ? String(value.length) : '0');

const PICTURE_SECTION: SettingsSection = {
  title: 'Picture',
  keys: [
    { key: 'widescreenAspect', label: 'Aspect Ratio' },
    { key: 'renderScale', label: 'Render Scale', format: times },
    { key: 'showFps', label: 'Show FPS' },
  ],
};

const WINDOW_SECTION: SettingsSection = {
  title: 'Window',
  keys: [
    { key: 'startFullscreen', label: 'Start in Fullscreen' },
    { key: 'viewportConstraint', label: 'Viewport', format: viewport },
    { key: 'pixelPerfect', label: 'Pixel Perfect' },
  ],
};

const AUDIO_SECTION: SettingsSection = {
  title: 'Audio',
  keys: [
    { key: 'masterVolume', label: 'Master Volume', format: percent },
  ],
};

const GAMEPLAY_SECTION: SettingsSection = {
  title: 'Gameplay',
  keys: [
    { key: 'original', label: 'Original Mode' },
    { key: 'autoSaveIntervalSeconds', label: 'Auto-Save Interval', format: seconds },
    { key: 'autoSaveMaxEntries', label: 'Max Auto-Save Entries' },
    { key: 'turboSpeed', label: 'Turbo Speed', format: times },
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
