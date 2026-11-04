/* @layer bridge-wasm @kind logic */
import type { OpenSession } from './session-tracker-state.type';

const sessionTrackerState: { open: OpenSession | null } = { open: null };

export { sessionTrackerState };
