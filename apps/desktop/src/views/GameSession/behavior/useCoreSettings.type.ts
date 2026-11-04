/* @layer renderer-appshell @kind logic */
import type { CkSettings } from '@chronoki/game-core';

interface CoreSettings {
  settings: CkSettings;
  config: string;
  volume: number;
  gates: ReadonlySet<string>;
  autoSaveIntervalSeconds: number;
  autoSaveMaxEntries: number;
  turboSpeed: number;
  saveHoldDuration: number;
}

export type { CoreSettings };
