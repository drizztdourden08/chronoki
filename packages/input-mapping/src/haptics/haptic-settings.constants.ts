/* @layer shared-input @kind constants */
import type { HapticSettings } from './haptic-settings.type';

const DEFAULT_HAPTIC_SETTINGS: HapticSettings = {
  enabled: false,
  intensity: 70,
  damageTaken: true,
  enemyDefeated: true,
};

export { DEFAULT_HAPTIC_SETTINGS };
