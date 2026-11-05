/* @layer bridge-wasm @kind type */
import type { CheckDef } from '@chronoki/game-core';

type CachedChecks = { profileId: string; checks: readonly CheckDef[] };

export type { CachedChecks };
