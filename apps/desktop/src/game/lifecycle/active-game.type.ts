/* @layer bridge-wasm @kind types */
import type { CkSettings } from '@chronoki/game-core';
import type { FileStore } from '@drizztdourden08/brock-core';
import type { SaveStore } from '@drizztdourden08/brock-port-kit';
import type { PortSession } from '@drizztdourden08/brock-port-kit/renderer';

interface ActiveGame {
  session: PortSession<CkSettings>;
  store: SaveStore;
  files: FileStore;
  canvas: HTMLCanvasElement;
  romFile: string;
  profileId: string | null;
  unsubscribePause: () => void;
}

export type { ActiveGame };
