/* @layer shared-input @kind logic */
import { DAMAGE_HIGH_THRESHOLD, DAMAGE_MEDIUM_THRESHOLD } from './haptic-events.constants';
import type { HapticPatternId } from '../data/haptics';

const getDamagePatternId = (percentOfMaxHp: number): HapticPatternId => {
  if (percentOfMaxHp >= DAMAGE_HIGH_THRESHOLD) return 'damageHigh';
  if (percentOfMaxHp >= DAMAGE_MEDIUM_THRESHOLD) return 'damageMedium';
  return 'damageLow';
};

export { getDamagePatternId };
