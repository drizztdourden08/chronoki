/* @layer renderer-components @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import { MODE_LABELS } from '../../../ProfileManager.constants';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { CREATING_HINT, FINISH_LABEL, STEP_IDS, STEP_LABELS } from '../ProfileCreateWizard.constants';
import { profileProblem } from './profile-problem';

const profileWizardSteps: readonly WizardStepDef<ProfileWizardValues>[] = [
  {
    id: STEP_IDS.profile,
    label: STEP_LABELS.profile,
    validate: profileProblem,
    summary: ({ name, rom }) => [name.trim(), rom].filter((part) => part !== '').join(', ') || undefined,
  },
  {
    id: STEP_IDS.mode,
    label: STEP_LABELS.mode,
    summary: ({ mode }) => MODE_LABELS[mode],
  },
  {
    id: STEP_IDS.review,
    label: STEP_LABELS.review,
    buttons: { next: { label: FINISH_LABEL } },
    busyHint: () => CREATING_HINT,
  },
];

export { profileWizardSteps };
