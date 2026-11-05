/* @layer bridge-wasm @kind constants */
import type { LogRule } from '@drizztdourden08/brock-randomizer';

const CT_LOG_RULES: readonly LogRule[] = [
  { pattern: /\[Boot] Seed .* written to the game pack/, kind: 'boot', tag: 'PACK' },
  { pattern: /\[Boot] Game not started/, kind: 'boot', tag: 'BOOT' },
  { pattern: /In-game save load detected/, kind: 'local', tag: 'LOAD' },
  { pattern: /\[Goal] /, kind: 'goal', tag: 'GOAL' },
];

export { CT_LOG_RULES };
