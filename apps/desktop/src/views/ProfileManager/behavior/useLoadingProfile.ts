/* @layer renderer-components @kind hook */
import type { Profile } from '@drizztdourden08/brock-core';
import { useGameSession } from '@app/views/GameSession';

const useLoadingProfile = (profiles: Profile[]): string | null => {
  const { launch, running } = useGameSession();
  if (launch === null || running) return null;
  return profiles.find((profile) => profile.id === launch.profileId)?.name ?? null;
};

export { useLoadingProfile };
