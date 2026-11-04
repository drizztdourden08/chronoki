/* @layer renderer-components @kind component */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardValues } from '../../ProfileManager.type';
import { RANDOMIZER_OPTIONS_STEP_ID } from './behavior/module-profile-steps.constants';
import { useModuleProfileSteps } from './behavior/useModuleProfileSteps';
import { CtOptionsStepBody } from './sub-components/CtOptionsStepBody';
import type { CtOptionsSlice } from './sub-components/CtOptionsStepBody';

const ModuleStepBody = ({ wizard }: { wizard: WizardApi<ProfileWizardValues> }) => {
  const { values, update } = wizard;
  const moduleStep = useModuleProfileSteps().find((step) => step.id === wizard.current.id);
  if (!moduleStep) return null;
  const value = (values[moduleStep.slice] ?? moduleStep.initial()) as object;
  const onChange = (patch: object) => update({ [moduleStep.slice]: { ...value, ...patch } });
  if (moduleStep.id === RANDOMIZER_OPTIONS_STEP_ID) return <CtOptionsStepBody value={value as CtOptionsSlice} onChange={onChange} />;
  const { Body } = moduleStep;
  return <Body value={value} values={values} onChange={onChange} />;
};

export { ModuleStepBody };
