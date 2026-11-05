/* @layer bridge-wasm @kind constants */
import type { CtStartState } from './ct-start-state.type';
import { STANDARD_START } from './standard-start.constants';

const LOST_WORLDS_START: CtStartState = { ...STANDARD_START, id: 'jot-lost-worlds' };

export { LOST_WORLDS_START };
