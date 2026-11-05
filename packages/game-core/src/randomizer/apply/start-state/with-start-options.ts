/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtStartState } from './ct-start-state.type';
import { withEpochFail } from './with-epoch-fail';
import { withOptionFlags } from './with-option-flags';

const withStartOptions = (state: CtStartState, options: CtOptionValues = {}): CtStartState =>
  withEpochFail(withOptionFlags(state, options), options);

export { withStartOptions };
