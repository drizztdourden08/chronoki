/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_SET_EDGE_ENV } from './env-frame.constants';
import type { CkEnvCalls } from './env-frame.type';

/* turns the engine's environment picture on (the Edge Effect draws) or off; a core without it is left alone */
const setEdgeEnv = (calls: CkEnvCalls | null, on: boolean): void => {
  if (!calls || !calls.has(CK_EXPORT_SET_EDGE_ENV)) return;
  calls.call(CK_EXPORT_SET_EDGE_ENV, on ? 1 : 0);
};

export { setEdgeEnv };
