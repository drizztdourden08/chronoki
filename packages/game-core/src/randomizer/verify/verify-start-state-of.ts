/* @layer bridge-wasm @kind logic */
import type { CtStartState } from '../apply/start-state/ct-start-state.type';
import { withOptionFlags } from '../apply/start-state/with-option-flags';
import { START_STATES } from '../apply/start-state/start-states.constants';
import type { CtOptionValues } from '../world/ct-world-input.type';
import { modeOf } from '../world/modes/mode-of';

const startStateOf = (options: CtOptionValues): CtStartState => {
  const state = START_STATES[modeOf(options).startState];
  if (state === undefined) throw new Error('This game mode has no start state yet.');
  return withOptionFlags(state, options);
};

export { startStateOf };
