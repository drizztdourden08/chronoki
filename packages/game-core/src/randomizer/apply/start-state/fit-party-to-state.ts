/* @layer bridge-wasm @kind logic */
import type { CtStartParty } from '../../world/party/ct-party.type';
import { buildStartBlock } from './build-start-block';
import type { CtStartState } from './ct-start-state.type';
import { INTRO_JUMP, START_BLOCK_MAX_BYTES } from './start-block.constants';
import { startBlocksOf } from './start-blocks-of';

const cronoFirst = (party: CtStartParty): CtStartParty =>
  party.includes('crono') ? ['crono', ...party.filter((character) => character !== 'crono')] : party;

const singleFits = (state: CtStartState, party: CtStartParty): boolean =>
  buildStartBlock(state, party, INTRO_JUMP).length <= START_BLOCK_MAX_BYTES;

const fitPartyToState = (party: CtStartParty, state: CtStartState): CtStartParty => {
  if (singleFits(state, party)) return party;
  const first = cronoFirst(party);
  if (singleFits(state, first)) return first;
  return startBlocksOf(state, party).late.length <= START_BLOCK_MAX_BYTES ? party : first;
};

export { fitPartyToState };
