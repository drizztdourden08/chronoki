/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_SET_HAPTICS } from './live-settings.constants';
import { liveSettingsState } from './live-settings-state';
import type { LiveCalls } from './live-settings.type';
import { tryVoidCcall } from './try-void-ccall';

const reassertHaptics = (calls: LiveCalls | null): void => {
  tryVoidCcall(calls, CK_EXPORT_SET_HAPTICS, liveSettingsState.haptics ? 1 : 0);
};

export { reassertHaptics };
