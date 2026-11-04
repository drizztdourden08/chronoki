/* @layer renderer-components @kind hook */
import { useCallback, useMemo, useRef, useState } from 'react';
import { placeWizardSteps, useProfiles, wizardCreateOptions, wizardInitialSlices } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { useWizard } from '@drizztdourden08/tessera/composites';
import type { CreateOutcome } from '@drizztdourden08/tessera/composites';
import { DEFAULT_PROFILE_PRESET, applyProfilePreset } from '@app/profiles/presets';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { profileWizardSteps } from './profile-wizard-steps';
import { useModuleProfileSteps } from './useModuleProfileSteps';

const errorMessage = (failure: unknown): string => (failure instanceof Error ? failure.message : String(failure));

const useProfileWizard = (onCreated: (profile: Profile) => void) => {
  const { create } = useProfiles();
  const created = useRef<Profile | null>(null);
  const moduleSteps = useModuleProfileSteps();
  const steps = useMemo(() => placeWizardSteps(profileWizardSteps, moduleSteps), [moduleSteps]);
  const [initialValues] = useState<ProfileWizardValues>(() => ({
    ...wizardInitialSlices(moduleSteps), name: '', rom: '', preset: DEFAULT_PROFILE_PRESET,
  }));

  const handleFinish = useCallback(async (values: ProfileWizardValues): Promise<CreateOutcome> => {
    const { name, rom, preset } = values;
    try {
      const extra = wizardCreateOptions(moduleSteps, values);
      const profile = await create({ ...extra, name: name.trim(), romFile: rom, initialConfig: applyProfilePreset(preset) });
      created.current = profile;
      return { success: true, id: profile.id };
    } catch (failure) {
      return { success: false, error: errorMessage(failure) };
    }
  }, [create, moduleSteps]);

  const handleFinished = useCallback(() => {
    if (created.current) onCreated(created.current);
  }, [onCreated]);

  return useWizard({ steps, initialValues, onFinish: handleFinish, onFinished: handleFinished });
};

export { useProfileWizard };
