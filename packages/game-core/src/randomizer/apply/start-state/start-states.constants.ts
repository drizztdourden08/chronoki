/* @layer bridge-wasm @kind constants */
import type { CtStartState, CtStartStateId } from './ct-start-state.type';
import { STANDARD_START } from './standard-start.constants';

const START_STATES: Readonly<Partial<Record<CtStartStateId, CtStartState>>> = {
  [STANDARD_START.id]: STANDARD_START,
};

export { START_STATES };
