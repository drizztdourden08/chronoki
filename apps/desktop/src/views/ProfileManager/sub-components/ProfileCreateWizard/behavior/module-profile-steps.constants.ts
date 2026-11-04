/* @layer renderer-components @kind constants */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { randomizerRenderer } from '@drizztdourden08/brock-randomizer/renderer';

const RANDOMIZER_STEPS: ReadonlySet<ProfileWizardStepDef> = new Set(randomizerRenderer.profileWizardSteps ?? []);

const RANDOMIZER_STEP_ID = 'randomizer';
const RANDOMIZER_SLICE = 'randomizer';
const RANDOMIZER_OPTIONS_STEP_ID = 'randomizer-options';

const RANDOMIZER_REVIEW = {
  title: 'Randomizer',
  status: 'Randomizer',
  off: 'Off',
  seed: 'Seed',
  randomSeed: 'Random',
  mode: 'Mode',
  modes: { local: 'Local (offline)', online: 'Online' } as Record<string, string>,
} as const;

export { RANDOMIZER_OPTIONS_STEP_ID, RANDOMIZER_REVIEW, RANDOMIZER_SLICE, RANDOMIZER_STEP_ID, RANDOMIZER_STEPS };
