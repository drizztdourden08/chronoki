/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { effectiveOptionsOf } from '../../world/modes/effective-options-of';
import { modeOf } from '../../world/modes/mode-of';
import { fitPartyToState } from './fit-party-to-state';
import { START_STATES } from './start-states.constants';
import { withOptionFlags } from './with-option-flags';

const fitStartParty = (party: CtStartParty, options: CtOptionValues = {}): CtStartParty => {
  const effective = effectiveOptionsOf(options);
  const state = START_STATES[modeOf(effective).startState];
  return state === undefined ? party : fitPartyToState(party, withOptionFlags(state, effective));
};

export { fitStartParty };
