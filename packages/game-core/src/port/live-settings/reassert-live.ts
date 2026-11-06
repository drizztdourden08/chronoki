/* @layer bridge-wasm @kind logic */
import type { LiveCalls } from './live-settings.type';
import { reassertDialogPacing } from './reassert-dialog-pacing';
import { reassertDimFlashes } from './reassert-dim-flashes';
import { reassertHaptics } from './reassert-haptics';

const reassertLive = (calls: LiveCalls | null): void => {
  reassertDimFlashes(calls);
  reassertHaptics(calls);
  reassertDialogPacing(calls);
};

export { reassertLive };
