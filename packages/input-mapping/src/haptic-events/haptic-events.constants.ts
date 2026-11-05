/* @layer shared-input @kind constants */
const HapticEventType = {
  DAMAGE_TAKEN: 1,
  ENEMY_DEFEATED: 2,
} as const;

const DAMAGE_HIGH_THRESHOLD = 25;
const DAMAGE_MEDIUM_THRESHOLD = 10;

export { DAMAGE_HIGH_THRESHOLD, DAMAGE_MEDIUM_THRESHOLD, HapticEventType };
