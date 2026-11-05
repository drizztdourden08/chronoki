/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';

type CachedChecks = { profileId: string; checks: readonly CheckDef[] };

const byProfile = new Map<string, readonly CheckDef[]>();
let latestId: string | null = null;

const checksCache = {
  remember: (profileId: string, checks: readonly CheckDef[]): void => {
    if (checks.length === 0) return;
    byProfile.set(profileId, checks);
    latestId = profileId;
  },
  latest: (): CachedChecks | null => {
    const checks = latestId === null ? undefined : byProfile.get(latestId);
    return latestId === null || checks === undefined ? null : { profileId: latestId, checks };
  },
  clear: (): void => {
    byProfile.clear();
    latestId = null;
  },
};

export { checksCache };
export type { CachedChecks };
