/* @layer bridge-wasm @kind logic */
import { DIALOG_NEUTRAL_PACING } from '../dialog-pacing/dialog-pacing.constants';
import type { LiveSettingsState } from './live-settings.type';

const liveSettingsState: LiveSettingsState = {
  dimFlashes: false,
  haptics: false,
  dialogPacing: { ...DIALOG_NEUTRAL_PACING },
};

export { liveSettingsState };
