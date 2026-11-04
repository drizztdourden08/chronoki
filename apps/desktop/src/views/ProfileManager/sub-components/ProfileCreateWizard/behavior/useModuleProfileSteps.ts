/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import { useModuleWizardSteps, useSettings } from '@drizztdourden08/brock-react';
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { RANDOMIZER_GATE } from '@app/game/randomizer';
import { effectiveGatesOf } from '@app/settings-controls/effective-gates-of';
import type { AppSettings } from '@app/settings.type';
import { RANDOMIZER_STEPS } from './module-profile-steps.constants';

const useModuleProfileSteps = (): readonly ProfileWizardStepDef[] => {
  const steps = useModuleWizardSteps();
  const { settings } = useSettings<AppSettings>();
  const randomizerOn = effectiveGatesOf(settings).has(RANDOMIZER_GATE);
  return useMemo(() => (randomizerOn ? steps : steps.filter((step) => !RANDOMIZER_STEPS.has(step))), [steps, randomizerOn]);
};

export { useModuleProfileSteps };
