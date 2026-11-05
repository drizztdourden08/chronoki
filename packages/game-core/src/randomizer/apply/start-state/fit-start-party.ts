/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { modeOf } from '../../world/modes/mode-of';
import { fitPartyToState } from './fit-party-to-state';
import { START_STATES } from './start-states.constants';
import { withOptionFlags } from './with-option-flags';

const fitStartParty = (party: CtStartParty, options: CtOptionValues = {}): CtStartParty => {
  const state = START_STATES[modeOf(options).startState];
  return state === undefined ? party : fitPartyToState(party, withOptionFlags(state, options));
};

export { fitStartParty };
