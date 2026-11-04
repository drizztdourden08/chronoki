/* @layer bridge-wasm @kind logic */
import type { GateMode } from '@chronoki/design';
import { sessionTrackerState } from './session-tracker-state';

const startSession = (profileId: string, mode: GateMode): void => {
  if (sessionTrackerState.open) return;
  sessionTrackerState.open = { profileId, startedAt: Date.now(), mode };
};

export { startSession };
