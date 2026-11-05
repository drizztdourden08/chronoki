/* @layer renderer-components @kind hook */
import { useProfilesStore } from '@drizztdourden08/brock-react';

const useIsRandomizerRun = (profileId: string | null): boolean =>
  useProfilesStore((state) => state.profiles.find((profile) => profile.id === profileId)?.randomizer !== undefined);

export { useIsRandomizerRun };
