/* @layer bridge-wasm @kind type */
import type { CheckDef, CtPlacement } from '@chronoki/game-core';
import type { TrackerProvider } from '@drizztdourden08/brock-randomizer/tracker';
import type { CachedChecks } from './checks-cache.type';

type Built = Pick<Required<TrackerProvider<CtPlacement>>, 'world' | 'vanilla' | 'sphereOf'>;
type Current = { source: CachedChecks | null; checks: readonly CheckDef[]; built: Built };

export type { Built, Current };
