/* @layer renderer-appshell @kind logic */
import type { CkSettings } from '@chronoki/game-core';
import type { PixelArea } from '@chronoki/features';

interface CoreSettings {
  settings: CkSettings;
  config: string;
  volume: number;
  gates: ReadonlySet<string>;
  pictureRatio: number;
  autoSaveIntervalSeconds: number;
  autoSaveMaxEntries: number;
  turboSpeed: number;
  saveHoldDuration: number;
}

interface DisplayInputs {
  screenRatio: number;
  stageArea: PixelArea | undefined;
  wholePixels: boolean;
}

export type { CoreSettings, DisplayInputs };
