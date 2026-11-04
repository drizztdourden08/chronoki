/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { RenderScaleFactor, WideAspect } from '@chronoki/features';

type ViewportMode = 'none' | 'fit' | 'fill';

interface AppSettings extends BaseSettings {
  original: boolean;
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
}

export type { AppSettings, ViewportMode };
