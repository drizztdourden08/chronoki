/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { ONLINE_NOTICE_DEFAULTS } from '@drizztdourden08/brock-randomizer/archipelago';
import { DEFAULT_GATE_OPTIONS, DEFAULT_GATES } from '@chronoki/features';
import { DEFAULT_HAPTIC_SETTINGS } from '@chronoki/input-mapping';
import { AUDIO_OUTPUT_AUTO, DEFAULT_AUDIO_SAMPLES } from './game/audio-lead';
import { DEFAULT_HIGHLIGHTS } from './settings-controls/highlight/highlight.constants';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  ...ONLINE_NOTICE_DEFAULTS,
  vanillaSafe: false,
  gates: DEFAULT_GATES,
  aspectRatio: DEFAULT_GATE_OPTIONS.aspectRatio,
  customAspectW: DEFAULT_GATE_OPTIONS.customAspectW,
  customAspectH: DEFAULT_GATE_OPTIONS.customAspectH,
  renderScale: DEFAULT_GATE_OPTIONS.renderScale,
  autoSaveIntervalSeconds: 300,
  masterVolume: 100,
  masterMuted: false,
  displayPerfInTitle: false,
  viewportConstraint: 'none',
  pixelPerfect: false,
  autoSaveMaxEntries: 5,
  turboSpeed: 2,
  dialogSpeed: 1,
  dialogHoldSpeed: 2,
  dialogHoldToAccelerate: true,
  dialogFillOnB: true,
  dialogAutoSkip: false,
  ...DEFAULT_HIGHLIGHTS,
  haptics: { ...DEFAULT_HAPTIC_SETTINGS },
  experimentalFeaturesEnabled: false,
  saveHoldDuration: 2,
  musicVolume: 100,
  musicMuted: false,
  sfxVolume: 100,
  sfxMuted: false,
  msuConfigMode: 'auto',
  enableMSU: 'false',
  resumeMSU: true,
  resetMSUAtTitle: true,
  msuChipFallback: true,
  packReplaceSfx: true,
  vsync: false,
  audioSamples: DEFAULT_AUDIO_SAMPLES,
  audioFreq: AUDIO_OUTPUT_AUTO,
  audioChannels: AUDIO_OUTPUT_AUTO,
};

export { DEFAULT_SETTINGS };
