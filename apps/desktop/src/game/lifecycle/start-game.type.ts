/* @layer bridge-wasm @kind types */
import type { CkSettings } from '@chronoki/game-core';
import type { FileStore } from '@drizztdourden08/brock-core';

interface StartGameRequest {
  canvas: HTMLCanvasElement;
  files: FileStore;
  romFile: string;
  profileId: string | null;
  config?: string;
  settings?: CkSettings;
  volume?: number;
}

export type { StartGameRequest };
