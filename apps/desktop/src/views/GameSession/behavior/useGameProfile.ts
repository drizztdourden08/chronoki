/* @layer renderer-appshell @kind hook */
import { instanceProfile, useProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';

const useGameProfile = (): { profile: Profile | null; loaded: boolean } => {
  const { active, profiles, lastProfileId, loaded } = useProfiles();
  const pinned = instanceProfile() !== null;
  const fallback = pinned ? null : profiles.find((candidate) => candidate.id === lastProfileId) ?? profiles[0] ?? null;
  return { profile: active ?? fallback, loaded };
};

export { useGameProfile };
