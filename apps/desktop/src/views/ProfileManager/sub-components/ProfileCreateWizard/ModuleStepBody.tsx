/* @layer renderer-components @kind component */
import type { ModuleStepBodyProps } from './ModuleStepBody.type';
import { useModuleProfileSteps } from './behavior/useModuleProfileSteps';

const ModuleStepBody = ({ wizard, subStep, onSubStepChange }: ModuleStepBodyProps) => {
  const { values, update } = wizard;
  const moduleStep = useModuleProfileSteps().find((step) => step.id === wizard.current.id);
  if (!moduleStep) return null;
  const value = (values[moduleStep.slice] ?? moduleStep.initial());
  const { Body } = moduleStep;
  return <Body value={value} values={values} subStep={subStep} onSubStepChange={onSubStepChange} onChange={(patch: object) => update({ [moduleStep.slice]: { ...value, ...patch } })} />;
};

export { ModuleStepBody };
