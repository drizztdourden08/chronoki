/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_SET_EDGE_ENV } from './env-frame.constants';
import type { CkEnvCalls } from './env-frame.type';

const setEdgeEnv = (calls: CkEnvCalls | null, on: boolean): void => {
  if (!calls?.has(CK_EXPORT_SET_EDGE_ENV)) return;
  calls.call(CK_EXPORT_SET_EDGE_ENV, on ? 1 : 0);
};

export { setEdgeEnv };
