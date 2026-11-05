/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { OPTIONS_STEP_ID } from '@drizztdourden08/brock-randomizer/renderer';

const useOptionSubStep = () => {
  const [optionTab, setOptionTab] = useState<string | undefined>(undefined);
  const selectSubStep = useCallback((stepId: string, subStepId: string) => {
    if (stepId === OPTIONS_STEP_ID) setOptionTab(subStepId);
  }, []);
  return { optionTab, selectSubStep, setOptionTab };
};

export { useOptionSubStep };
