/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_SET_DIM_FLASHES } from './live-settings.constants';
import { liveSettingsState } from './live-settings-state';
import type { LiveCalls } from './live-settings.type';
import { tryVoidCcall } from './try-void-ccall';

const reassertDimFlashes = (calls: LiveCalls | null): void => {
  tryVoidCcall(calls, CK_EXPORT_SET_DIM_FLASHES, liveSettingsState.dimFlashes ? 1 : 0);
};

export { reassertDimFlashes };
