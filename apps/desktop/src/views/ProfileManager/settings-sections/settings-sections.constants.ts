/* @layer renderer-components @kind constants */
import { gateRow } from './gate-row';
import type { SettingFormat, SettingsSection } from './settings-sections.type';

const VIEWPORT_LABELS: Readonly<Record<string, string>> = { none: 'Letterbox', fit: 'Fit Window', fill: 'Stretch' };

const viewport: SettingFormat = (value) => (typeof value === 'string' ? (VIEWPORT_LABELS[value] ?? value) : 'Default');

const percent: SettingFormat = (value) => (typeof value === 'number' ? `${Math.round(value <= 1 ? value * 100 : value)}%` : 'Default');

const times: SettingFormat = (value) => (typeof value === 'number' ? `${value}x` : 'Default');

const seconds: SettingFormat = (value) => (typeof value === 'number' ? `${value} s` : 'Default');

const turbo: SettingFormat = (value) => (typeof value === 'number' ? `${Number(value.toFixed(2))}x` : 'Default');

const PICTURE_SECTION: SettingsSection = {
  title: 'Picture',
  keys: [
    gateRow('widescreen'),
    gateRow('tallRendering'),
    { key: 'aspectRatio', label: 'Aspect Ratio' },
    gateRow('extendY'),
    gateRow('cameraLock'),
    gateRow('sceneAdjust'),
    gateRow('wideSteamMargins'),
    gateRow('fillBottomLine'),
    { key: 'showFps', label: 'Show FPS' },
    gateRow('interpolate'),
    gateRow('freeSync'),
  ],
};

const GRAPHICS_SECTION: SettingsSection = {
  title: 'Graphics',
  keys: [
    gateRow('renderScale'),
    { key: 'renderScale', label: 'Render Scale', format: times },
    gateRow('linearFiltering'),
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
    gateRow('instantUploads'),
  ],
};

const GAMEPLAY_SECTION: SettingsSection = {
  title: 'Gameplay',
  keys: [
    gateRow('autoSave'),
    { key: 'autoSaveIntervalSeconds', label: 'Auto-Save Interval', format: seconds },
    { key: 'autoSaveMaxEntries', label: 'Max Auto-Save Entries' },
    gateRow('saveOnQuit'),
    gateRow('enhancedSaveSlotShortcut'),
    { key: 'saveHoldDuration', label: 'Hold to Save Duration', format: seconds },
    gateRow('turbo'),
    { key: 'turboSpeed', label: 'Turbo Speed', format: turbo },
    { key: 'vanillaSafe', label: 'Vanilla Safe' },
  ],
};

const SETTINGS_SECTIONS: SettingsSection[] = [PICTURE_SECTION, GRAPHICS_SECTION, WINDOW_SECTION, AUDIO_SECTION, GAMEPLAY_SECTION];

export { SETTINGS_SECTIONS };
