/* @layer renderer-components @kind view */
import { Wizard } from '@drizztdourden08/tessera/composites';
import type { ProfileCreateWizardProps } from '../../ProfileManager.type';
import { WIZARD_TITLE } from './ProfileCreateWizard.constants';
import { ProfileStepBody } from './ProfileStepBody';
import { useProfileWizard } from './behavior/useProfileWizard';

const ProfileCreateWizard = ({ readyRoms, onCancel, onCreated }: ProfileCreateWizardProps) => {
  const wizard = useProfileWizard(onCreated);

  return (
    <Wizard wizard={wizard} title={WIZARD_TITLE} orientation="vertical" stepperSize="sm" onExit={onCancel}>
      <ProfileStepBody wizard={wizard} readyRoms={readyRoms} />
    </Wizard>
  );
};

export { ProfileCreateWizard };
