/* @layer renderer-components @kind component */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../ProfileManager.type';
import { useModuleProfileSteps } from './behavior/useModuleProfileSteps';

const ModuleStepBody = ({ wizard }: { wizard: WizardApi<ProfileWizardValues> }) => {
  const { values, update } = wizard;
  const moduleStep = useModuleProfileSteps().find((step) => step.id === wizard.current.id);
  if (!moduleStep) return null;
  const value = (values[moduleStep.slice] ?? moduleStep.initial());
  const { Body } = moduleStep;
  return <Body value={value} values={values} onChange={(patch: object) => update({ [moduleStep.slice]: { ...value, ...patch } })} />;
};

export { ModuleStepBody };
