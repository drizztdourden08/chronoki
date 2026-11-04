/* @layer bridge-wasm @kind types */
import type { CkSettings } from '@chronoki/game-core';
import type { SaveStore } from '@drizztdourden08/brock-port-kit';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';

interface SaveStateContext {
  core: GameCore<CkSettings>;
  store: SaveStore;
  canvas: HTMLCanvasElement;
  romFile: string;
  profileId: string | null;
}

type StateFailure =
  | 'unavailable' | 'not-running' | 'no-profile' | 'failed' | 'timeout' | 'missing' | 'corrupt' | 'refused' | 'not-now';

type StateResult = { ok: true } | { ok: false; reason: StateFailure; message?: string };

type StateOutcome = 'ok' | 'failed' | 'timeout' | 'not-now';

export type { SaveStateContext, StateFailure, StateOutcome, StateResult };
