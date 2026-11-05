/* @layer renderer-components @kind logic */
import { setEdgeEnv } from '@chronoki/game-core';
import type { CkEnvCalls } from '@chronoki/game-core';

const syncEdgeEnv = (calls: CkEnvCalls | null, onRef: { current: boolean }, want: boolean): void => {
  if (onRef.current === want) return;
  onRef.current = want;
  setEdgeEnv(calls, want);
};

export { syncEdgeEnv };
