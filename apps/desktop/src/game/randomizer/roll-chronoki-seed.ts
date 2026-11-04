/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { rollCtPlacement } from '@chronoki/game-core';
import { NO_CHECKS_ROLL } from './chronoki-randomizer.constants';
import { ctChecksCache } from './ct-checks-cache';

const rollChronokiSeed = (config: RandomizerProfileConfig): CtPlacement => {
  const checks = ctChecksCache.checks();
  if (checks === null || checks.length === 0) throw new Error(NO_CHECKS_ROLL);
  return rollCtPlacement({ checks, options: config.options }, config.seed);
};

export { rollChronokiSeed };
