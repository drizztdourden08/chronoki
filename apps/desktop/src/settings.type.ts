/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { AspectRatioChoice, RenderScaleFactor } from '@chronoki/features';

type ViewportMode = 'none' | 'fit' | 'fill';

type MsuConfigMode = 'auto' | 'manual';

type MsuFormat = 'false' | 'msu1' | 'opuz' | 'layered';

interface AppSettings extends BaseSettings {
  vanillaSafe: boolean;
  gates: string[];
  knownGates?: string[];
  flippedDefaults?: string[];
  aspectRatio: AspectRatioChoice;
  customAspectW: number;
  customAspectH: number;
  renderScale: RenderScaleFactor;
  autoSaveIntervalSeconds: number;
  masterMuted: boolean;
  volumeScale?: number;
  displayPerfInTitle: boolean;
  viewportConstraint: ViewportMode;
  pixelPerfect: boolean;
  autoSaveMaxEntries: number;
  turboSpeed: number;
  dialogSpeed: number;
  dialogHoldSpeed: number;
  dialogHoldToAccelerate: boolean;
  dialogFillOnB: boolean;
  dialogAutoSkip: boolean;
  saveHoldDuration: number;
  musicVolume: number;
  musicMuted: boolean;
  sfxVolume: number;
  sfxMuted: boolean;
  msuConfigMode: MsuConfigMode;
  enableMSU: MsuFormat;
  resumeMSU: boolean;
  resetMSUAtTitle: boolean;
  msuChipFallback: boolean;
  packReplaceSfx: boolean;
  vsync: boolean;
  audioSamples: number;
  audioFreq: number;
  audioChannels: number;
}

export type { AppSettings, MsuConfigMode, MsuFormat, ViewportMode };
