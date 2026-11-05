/* @layer shared-input @kind data */
import type { HapticPatternRecipe } from './haptic-pattern.type';

const COMBAT_PATTERNS = {
  enemyDefeated: {
    shape: { kind: 'pulse', durationMs: 80, intensity: 0.50 },
    delayMs: 0,
    cooldownMs: 60,
  },

  damageLow: {
    shape: { kind: 'pulse', durationMs: 100, intensity: 0.40 },
    delayMs: 0,
    cooldownMs: 200,
  },

  damageMedium: {
    shape: { kind: 'pulse', durationMs: 150, intensity: 0.70 },
    delayMs: 0,
    cooldownMs: 200,
  },

  damageHigh: {
    shape: { kind: 'pulse', durationMs: 200, intensity: 1.0 },
    delayMs: 0,
    cooldownMs: 200,
  },
} satisfies Record<string, HapticPatternRecipe>;

export { COMBAT_PATTERNS };
