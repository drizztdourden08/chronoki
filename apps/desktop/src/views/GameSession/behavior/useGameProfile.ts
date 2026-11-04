/* @layer renderer-appshell @kind hook */
import { useProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';

const useGameProfile = (): { profile: Profile | null; loaded: boolean } => {
  const { active, profiles, lastProfileId, loaded } = useProfiles();
  const profile = active ?? profiles.find((candidate) => candidate.id === lastProfileId) ?? profiles[0] ?? null;
  return { profile, loaded };
};

export { useGameProfile };
