/* @layer renderer-components @kind types */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues, ReadyRom } from '../../ProfileManager.type';

type ProfileStepBodyProps = {
  wizard: WizardApi<ProfileWizardValues>;
  readyRoms: ReadyRom[];
  subStep?: string;
  onSubStepChange?: (subStep: string) => void;
};

export type { ProfileStepBodyProps };
