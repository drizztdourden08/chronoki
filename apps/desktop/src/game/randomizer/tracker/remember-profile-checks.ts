/* @layer bridge-wasm @kind logic */
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { checksOfRom } from '../checks-of-rom';
import { checksCache } from './checks-cache';

const rememberProfileChecks = async (profileId: string | null): Promise<void> => {
  if (profileId === null) return;
  const profile = useProfilesStore.getState().profiles.find((entry) => entry.id === profileId);
  if (profile?.randomizer === undefined || !profile.romFile) return;
  checksCache.remember(profileId, await checksOfRom(profile.romFile));
};

export { rememberProfileChecks };
