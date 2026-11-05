/* @layer bridge-wasm @kind logic */
import type { LiveCalls } from './live-settings.type';
import { reassertDimFlashes } from './reassert-dim-flashes';

const reassertLive = (calls: LiveCalls | null): void => {
  reassertDimFlashes(calls);
};

export { reassertLive };
