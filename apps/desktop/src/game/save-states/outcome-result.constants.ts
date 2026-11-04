/* @layer bridge-wasm @kind constants */
import type { StateFailure, StateOutcome } from './save-state.type';

const OUTCOME_FAILURE: Record<Exclude<StateOutcome, 'ok'>, StateFailure> = {
  failed: 'failed',
  timeout: 'timeout',
  'not-now': 'not-now',
};

export { OUTCOME_FAILURE };
