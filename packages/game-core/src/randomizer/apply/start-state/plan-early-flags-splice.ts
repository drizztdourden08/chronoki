/* @layer bridge-wasm @kind logic */
import { opEquals } from '../modes/op-equals';
import type { ScriptSplice } from '../script/script-splice.type';
import type { CtStartParty } from '../../world/party/ct-party.type';
import type { CtStartState } from './ct-start-state.type';
import { fitPartyToState } from './fit-party-to-state';
import { EARLY_ANCHOR, EARLY_MAX_BYTES } from './start-split.constants';
import { startBlocksOf } from './start-blocks-of';
import { StartBlockTooLongError } from './start-block-too-long.error';

const planEarlyFlagsSplice = (state: CtStartState, party: CtStartParty): ScriptSplice | null => {
  const { early } = startBlocksOf(state, fitPartyToState(party, state));
  if (early.length === 0) return null;
  if (early.length > EARLY_MAX_BYTES) throw new StartBlockTooLongError(early.length, EARLY_MAX_BYTES);
  return { scene: 0, anchor: opEquals(EARLY_ANCHOR), replace: Uint8Array.from([...early, ...EARLY_ANCHOR]), why: `start-flags:${state.id}` };
};

export { planEarlyFlagsSplice };
