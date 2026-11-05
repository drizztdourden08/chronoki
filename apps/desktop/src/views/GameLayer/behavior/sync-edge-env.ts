/* @layer renderer-components @kind logic */
import { setEdgeEnv } from '@chronoki/game-core';
import type { CkEnvCalls } from '@chronoki/game-core';

/* The engine builds the environment picture only while the Edge Effect draws. Called every frame, it reaches the core
   only when the wanted state changes: with the gate off it is never on, so the core is never called (vanilla parity). */
const syncEdgeEnv = (calls: CkEnvCalls | null, onRef: { current: boolean }, want: boolean): void => {
  if (onRef.current === want) return;
  onRef.current = want;
  setEdgeEnv(calls, want);
};

export { syncEdgeEnv };
