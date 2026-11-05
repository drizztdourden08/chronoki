/* @layer bridge-wasm @kind logic */
import { callIfExported } from './call-if-exported';
import { CK_EXPORT_SET_DIALOG_PACING } from './live-settings.constants';
import { liveSettingsState } from './live-settings-state';
import type { LiveCalls } from './live-settings.type';

// Pushes the gated pacing (neutral when the gate is off, which takes the original single-step path).
const reassertDialogPacing = (calls: LiveCalls | null): void => {
  if (!calls) return;
  const { baseQ4, holdQ4, hold, fill } = liveSettingsState.dialogPacing;
  callIfExported(() => {
    if (calls.has(CK_EXPORT_SET_DIALOG_PACING)) calls.call(CK_EXPORT_SET_DIALOG_PACING, baseQ4, holdQ4, hold ? 1 : 0, fill ? 1 : 0);
  });
};

export { reassertDialogPacing };
