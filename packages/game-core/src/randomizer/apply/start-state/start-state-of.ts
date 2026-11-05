/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import { effectiveOptionsOf } from '../../world/modes/effective-options-of';
import { modeOf } from '../../world/modes/mode-of';
import type { CtStartState } from './ct-start-state.type';
import { START_STATES } from './start-states.constants';
import { withOptionFlags } from './with-option-flags';

const startStateOf = (options: CtOptionValues): CtStartState => {
  const effective = effectiveOptionsOf(options);
  const state = START_STATES[modeOf(effective).startState];
  if (state === undefined) throw new Error('This game mode has no start state yet.');
  return withOptionFlags(state, effective);
};

export { startStateOf };
