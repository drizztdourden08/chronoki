/* @layer renderer-components @kind hook */
import { useCallback, useRef, useState } from 'react';
import { useProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { useWizard } from '@drizztdourden08/tessera/composites';
import type { CreateOutcome } from '@drizztdourden08/tessera/composites';
import { DEFAULT_PROFILE_MODE } from '@app/profiles/storage/profiles.constants';
import type { ProfileWizardValues } from '../../../ProfileManager.type';
import { profileWizardSteps } from './profile-wizard-steps';

const errorMessage = (failure: unknown): string => (failure instanceof Error ? failure.message : String(failure));

const useProfileWizard = (onCreated: (profile: Profile) => void) => {
  const { create } = useProfiles();
  const created = useRef<Profile | null>(null);
  const [initialValues] = useState<ProfileWizardValues>({ name: '', rom: '', mode: DEFAULT_PROFILE_MODE });

  const handleFinish = useCallback(async ({ name, rom, mode }: ProfileWizardValues): Promise<CreateOutcome> => {
    try {
      const profile = await create({ name: name.trim(), romFile: rom, mode });
      created.current = profile;
      return { success: true, id: profile.id };
    } catch (failure) {
      return { success: false, error: errorMessage(failure) };
    }
  }, [create]);

  const handleFinished = useCallback(() => {
    if (created.current) onCreated(created.current);
  }, [onCreated]);

  return useWizard({ steps: profileWizardSteps, initialValues, onFinish: handleFinish, onFinished: handleFinished });
};

export { useProfileWizard };
