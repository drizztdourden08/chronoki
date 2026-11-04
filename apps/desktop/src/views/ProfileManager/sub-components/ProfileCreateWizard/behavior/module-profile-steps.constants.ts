/* @layer renderer-components @kind constants */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { RANDOMIZER_SLICE, RANDOMIZER_STEP_ID, randomizerRenderer } from '@drizztdourden08/brock-randomizer/renderer';

const RANDOMIZER_STEPS: ReadonlySet<ProfileWizardStepDef> = new Set(randomizerRenderer.profileWizardSteps ?? []);

const RANDOMIZER_REVIEW = {
  title: 'Randomizer',
  status: 'Randomizer',
  off: 'Off',
  seed: 'Seed',
  randomSeed: 'Random',
  mode: 'Mode',
  modes: { local: 'Local (offline)', online: 'Online' } as Record<string, string>,
} as const;

export { RANDOMIZER_REVIEW, RANDOMIZER_SLICE, RANDOMIZER_STEP_ID, RANDOMIZER_STEPS };
