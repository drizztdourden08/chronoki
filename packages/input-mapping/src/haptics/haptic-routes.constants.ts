/* @layer shared-input @kind constants */
import { HapticEventType, getDamagePatternId } from '../haptic-events';
import type { HapticRoute } from './haptics.type';

const HAPTIC_ROUTES: Partial<Record<number, HapticRoute>> = {
  [HapticEventType.DAMAGE_TAKEN]: { setting: 'damageTaken', pattern: getDamagePatternId },
  [HapticEventType.ENEMY_DEFEATED]: { setting: 'enemyDefeated', pattern: () => 'enemyDefeated' },
};

export { HAPTIC_ROUTES };
