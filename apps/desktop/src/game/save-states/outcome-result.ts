/* @layer bridge-wasm @kind logic */
import type { StateOutcome, StateResult } from './save-state.type';

const outcomeResult = (outcome: StateOutcome): StateResult =>
  outcome === 'ok' ? { ok: true } : { ok: false, reason: outcome === 'timeout' ? 'timeout' : 'failed' };

export { outcomeResult };
