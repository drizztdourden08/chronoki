/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { DEFAULT_GATE_OPTIONS, DEFAULT_GATES } from '@chronoki/features';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  vanillaSafe: false,
  gates: DEFAULT_GATES,
  widescreenAspect: DEFAULT_GATE_OPTIONS.widescreenAspect,
  renderScale: DEFAULT_GATE_OPTIONS.renderScale,
  steamDataImported: false,
  autoSaveIntervalSeconds: 300,
  masterVolume: 100,
  masterMuted: false,
  showFps: false,
  viewportConstraint: 'none',
  pixelPerfect: false,
  autoSaveMaxEntries: 5,
  turboSpeed: 2,
  saveHoldDuration: 2,
};

export { DEFAULT_SETTINGS };
