/* @layer renderer-components @kind view */
import { Wizard } from '@drizztdourden08/tessera/composites';
import type { ProfileCreateWizardProps } from '../../ProfileManager.type';
import { WIZARD_TITLE } from './ProfileCreateWizard.constants';
import { ProfileStepBody } from './ProfileStepBody';
import { useOptionSubStep } from './behavior/useOptionSubStep';
import { useProfileWizard } from './behavior/useProfileWizard';

const ProfileCreateWizard = ({ readyRoms, onCancel, onCreated }: ProfileCreateWizardProps) => {
  const wizard = useProfileWizard(onCreated);
  const { optionTab, selectSubStep } = useOptionSubStep();

  return (
    <Wizard wizard={wizard} title={WIZARD_TITLE} orientation="vertical" stepperSize="sm" activeSubStepId={optionTab} onSubStepSelect={selectSubStep} onExit={onCancel}>
      <ProfileStepBody wizard={wizard} readyRoms={readyRoms} subStep={optionTab} />
    </Wizard>
  );
};

export { ProfileCreateWizard };
