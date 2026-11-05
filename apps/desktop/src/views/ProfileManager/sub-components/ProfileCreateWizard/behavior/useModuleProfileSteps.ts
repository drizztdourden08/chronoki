/* @layer renderer-components @kind hook */
import { useModuleWizardSteps } from '@drizztdourden08/brock-react';
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';

const useModuleProfileSteps = (): readonly ProfileWizardStepDef[] => useModuleWizardSteps();

export { useModuleProfileSteps };
