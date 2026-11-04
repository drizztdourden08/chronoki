/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { DEFAULT_GATE_OPTIONS } from '@chronoki/features';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  original: true,
  gates: [],
  widescreenAspect: DEFAULT_GATE_OPTIONS.widescreenAspect,
  renderScale: DEFAULT_GATE_OPTIONS.renderScale,
  steamDataImported: false,
  autoSaveIntervalSeconds: 300,
  masterMuted: false,
  showFps: false,
  autoSaveMaxEntries: 5,
  turboSpeed: 4,
};

export { DEFAULT_SETTINGS };
