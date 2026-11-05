/* @layer bridge-wasm @kind logic */
import type { LiveCalls } from './live-settings.type';
import { reassertDialogPacing } from './reassert-dialog-pacing';
import { reassertDimFlashes } from './reassert-dim-flashes';

const reassertLive = (calls: LiveCalls | null): void => {
  reassertDimFlashes(calls);
  reassertDialogPacing(calls);
};

export { reassertLive };
