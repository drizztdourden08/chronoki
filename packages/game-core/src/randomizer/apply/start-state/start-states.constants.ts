/* @layer bridge-wasm @kind constants */
import type { CtStartStateId } from '../../world/modes/ct-mode-def.type';
import type { CtStartState } from './ct-start-state.type';
import { STANDARD_START } from './standard-start.constants';

const START_STATES: Readonly<Partial<Record<CtStartStateId, CtStartState>>> = {
  [STANDARD_START.id]: STANDARD_START,
};

export { START_STATES };
