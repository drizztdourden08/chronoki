/* @layer renderer-components @kind types */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../ProfileManager.type';

type ModuleStepBodyProps = {
  wizard: WizardApi<ProfileWizardValues>;
  subStep?: string;
  onSubStepChange?: (subStep: string) => void;
};

export type { ModuleStepBodyProps };
