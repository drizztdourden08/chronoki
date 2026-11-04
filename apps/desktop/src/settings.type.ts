/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { RenderScaleFactor, WideAspect } from '@chronoki/features';

interface AppSettings extends BaseSettings {
  original: boolean;
  gates: string[];
  widescreenAspect: WideAspect;
  renderScale: RenderScaleFactor;
  steamDataImported: boolean;
  autoSaveIntervalSeconds: number;
  masterMuted: boolean;
  showFps: boolean;
  autoSaveMaxEntries: number;
  turboSpeed: number;
}

export type { AppSettings };
