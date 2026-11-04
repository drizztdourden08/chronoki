/* @layer renderer-components @kind logic */
import type { RandomizerFormState } from '@drizztdourden08/brock-randomizer';
import type { WizardReviewSection } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { RANDOMIZER_REVIEW, RANDOMIZER_SLICE, RANDOMIZER_STEP_ID } from './module-profile-steps.constants';

const randomizerReviewSection = (values: ProfileWizardValues): WizardReviewSection | null => {
  const form = values[RANDOMIZER_SLICE] as RandomizerFormState | undefined;
  if (form === undefined) return null;
  const rows = form.enabled
    ? [
      { label: RANDOMIZER_REVIEW.seed, value: form.seed.trim() || RANDOMIZER_REVIEW.randomSeed },
      { label: RANDOMIZER_REVIEW.mode, value: RANDOMIZER_REVIEW.modes[form.mode] ?? form.mode },
    ]
    : [{ label: RANDOMIZER_REVIEW.status, value: RANDOMIZER_REVIEW.off }];
  return { stepId: RANDOMIZER_STEP_ID, title: RANDOMIZER_REVIEW.title, rows };
};

export { randomizerReviewSection };
