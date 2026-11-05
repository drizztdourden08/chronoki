/* @layer bridge-wasm @kind logic */
import { changeLocationTarget } from '../script/change-location-target';
import { isChangeLocation } from '../script/is-change-location';
import type { CtStartParty } from '../../world/party/ct-party.type';
import type { ScriptSplice } from '../script/script-splice.type';
import { buildStartBlock } from './build-start-block';
import type { CtStartState } from './ct-start-state.type';
import { fitPartyToState } from './fit-party-to-state';
import { LEGACY_PARTY } from './legacy-party.constants';
import { INTRO_JUMP, INTRO_WORLD, START_BLOCK_MAX_BYTES } from './start-block.constants';
import { StartBlockTooLongError } from './start-block-too-long.error';

const sameBytes = (op: Uint8Array): boolean => op.length === INTRO_JUMP.length && op.every((byte, i) => byte === INTRO_JUMP[i]);

const isIntroJump = (op: Uint8Array): boolean =>
  isChangeLocation(op) && changeLocationTarget(op) === INTRO_WORLD && sameBytes(op);

const planStartState = (state: CtStartState, party: CtStartParty = LEGACY_PARTY): ScriptSplice => {
  const replace = buildStartBlock(state, fitPartyToState(party, state), INTRO_JUMP);
  if (replace.length > START_BLOCK_MAX_BYTES) throw new StartBlockTooLongError(replace.length, START_BLOCK_MAX_BYTES);
  return { scene: 0, anchor: isIntroJump, replace, why: `start-state:${state.id}` };
};

export { planStartState };
