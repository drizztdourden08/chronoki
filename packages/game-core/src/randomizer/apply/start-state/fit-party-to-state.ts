/* @layer bridge-wasm @kind logic */
import type { CtStartParty } from '../../world/party/ct-party.type';
import { buildStartBlock } from './build-start-block';
import type { CtStartState } from './ct-start-state.type';
import { INTRO_JUMP, START_BLOCK_MAX_BYTES } from './start-block.constants';

const cronoFirst = (party: CtStartParty): CtStartParty =>
  party.includes('crono') ? ['crono', ...party.filter((character) => character !== 'crono')] : party;

const fitPartyToState = (party: CtStartParty, state: CtStartState): CtStartParty =>
  buildStartBlock(state, party, INTRO_JUMP).length > START_BLOCK_MAX_BYTES ? cronoFirst(party) : party;

export { fitPartyToState };
