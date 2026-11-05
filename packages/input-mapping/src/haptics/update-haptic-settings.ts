/* @layer shared-input @kind logic */
import { hapticState } from './haptic-state';
import type { HapticSettings } from './haptic-settings.type';

const updateHapticSettings = (settings: HapticSettings): void => {
  hapticState.settings = { ...settings };
};

export { updateHapticSettings };
