/* @layer bridge-wasm @kind logic */
import { OUTCOME_FAILURE } from './outcome-result.constants';
import type { StateOutcome, StateResult } from './save-state.type';

const outcomeResult = (outcome: StateOutcome): StateResult =>
  outcome === 'ok' ? { ok: true } : { ok: false, reason: OUTCOME_FAILURE[outcome] };

export { outcomeResult };
