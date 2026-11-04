/* @layer bridge-wasm @kind logic */
import type { RandomizerFormState, RandomizerOptions, RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { randomSeed } from './random-seed';

const chronokiToConfig = (form: RandomizerFormState, options: unknown): RandomizerProfileConfig => ({
  mode: form.mode,
  seed: form.seed.trim() || randomSeed(),
  options: (options ?? {}) as RandomizerOptions,
});

export { chronokiToConfig };
