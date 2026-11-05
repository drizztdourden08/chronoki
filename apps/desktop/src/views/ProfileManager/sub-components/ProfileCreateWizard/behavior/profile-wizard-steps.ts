/* @layer renderer-components @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { CREATING_HINT, FINISH_LABEL, STEP_IDS, STEP_LABELS } from '../ProfileCreateWizard.constants';
import { profileProblem } from './profile-problem';
import { profileSummary } from './profile-summary';

const profileWizardSteps: readonly WizardStepDef<ProfileWizardValues>[] = [
  {
    id: STEP_IDS.profile,
    label: STEP_LABELS.profile,
    validate: profileProblem,
    summary: profileSummary,
  },
  {
    id: STEP_IDS.review,
    label: STEP_LABELS.review,
    buttons: { next: { label: FINISH_LABEL } },
    busyHint: () => CREATING_HINT,
  },
];

export { profileWizardSteps };
