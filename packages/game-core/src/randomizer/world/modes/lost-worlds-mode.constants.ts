/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { stubModeOf } from './stub-mode-of';

const LOST_WORLDS_MODE: CtModeDef = stubModeOf('lost-worlds', 'Lost Worlds', {
  start: 'end-of-time',
  startState: 'jot-lost-worlds',
});

export { LOST_WORLDS_MODE };
