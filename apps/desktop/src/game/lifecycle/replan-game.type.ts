/* @layer bridge-wasm @kind types */
import type { CkSettings } from '@chronoki/game-core';

interface RunningPlan {
  config: string;
  settings: CkSettings;
}

interface ReplanRequest {
  from: RunningPlan;
  to: RunningPlan;
  volume: number;
}

type ReplanOutcome =
  | { kind: 'done' | 'reverted' | 'rescued'; plan: RunningPlan }
  | { kind: 'deferred' }
  | { kind: 'lost' };

export type { ReplanOutcome, ReplanRequest, RunningPlan };
