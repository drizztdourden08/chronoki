/* @layer bridge-wasm @kind logic */
import type { PollEntry } from '@drizztdourden08/brock-randomizer/session';
import type { AppliedSeed } from './local-run.type';

const armedCountsOf = (seed: AppliedSeed, polled: readonly PollEntry[]): Record<string, number> => ({
  'chest checks': polled.filter((entry) => entry.probe !== undefined).length,
  'gift checks': polled.filter((entry) => entry.probe === undefined).length,
  'host-tracked key items': seed.plan.virtual.length,
});

export { armedCountsOf };
