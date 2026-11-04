/* @layer renderer-components @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { CREATING_HINT, FINISH_LABEL, STEP_IDS, STEP_LABELS } from '../ProfileCreateWizard.constants';
import { presetLabelOf } from './preset-label-of';
import { profileProblem } from './profile-problem';

const profileWizardSteps: readonly WizardStepDef<ProfileWizardValues>[] = [
  {
    id: STEP_IDS.profile,
    label: STEP_LABELS.profile,
    validate: profileProblem,
    summary: ({ name, rom, preset }) => [name.trim(), rom, presetLabelOf(preset)].filter((part) => part !== '').join(', ') || undefined,
  },
  {
    id: STEP_IDS.review,
    label: STEP_LABELS.review,
    buttons: { next: { label: FINISH_LABEL } },
    busyHint: () => CREATING_HINT,
  },
];

export { profileWizardSteps };
