/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { RenderScaleFactor, WideAspect } from '@chronoki/features';

type ViewportMode = 'none' | 'fit' | 'fill';

type MsuConfigMode = 'auto' | 'manual';

type MsuFormat = 'false' | 'msu1' | 'opuz' | 'layered';

interface AppSettings extends BaseSettings {
  vanillaSafe: boolean;
  gates: string[];
  widescreenAspect: WideAspect;
  renderScale: RenderScaleFactor;
  steamDataImported: boolean;
  autoSaveIntervalSeconds: number;
  masterMuted: boolean;
  volumeScale?: number;
  showFps: boolean;
  viewportConstraint: ViewportMode;
  pixelPerfect: boolean;
  autoSaveMaxEntries: number;
  turboSpeed: number;
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
}

export type { AppSettings, MsuConfigMode, MsuFormat, ViewportMode };
