/* @layer shared-input @kind logic */
import { DEFAULT_HAPTIC_SETTINGS } from './haptic-settings.constants';
import type { HapticState } from './haptics.type';

const hapticState: HapticState = {
  settings: { ...DEFAULT_HAPTIC_SETTINGS },
  vibrateFn: null,
};

export { hapticState };
