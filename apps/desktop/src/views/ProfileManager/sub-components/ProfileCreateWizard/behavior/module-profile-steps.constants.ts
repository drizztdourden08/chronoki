/* @layer renderer-components @kind constants */
import { RANDOMIZER_SLICE, RANDOMIZER_STEP_ID } from '@drizztdourden08/brock-randomizer/renderer';

const RANDOMIZER_REVIEW = {
  title: 'Randomizer',
  status: 'Randomizer',
  off: 'Off',
  seed: 'Seed',
  randomSeed: 'Random',
  mode: 'Mode',
  modes: { local: 'Local (offline)', online: 'Online' } as Record<string, string>,
} as const;

export { RANDOMIZER_REVIEW, RANDOMIZER_SLICE, RANDOMIZER_STEP_ID };
