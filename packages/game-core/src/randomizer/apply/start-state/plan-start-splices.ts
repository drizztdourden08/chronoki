/* @layer bridge-wasm @kind logic */
import type { ScriptSplice } from '../script/script-splice.type';
import type { CtStartParty } from '../../world/party/ct-party.type';
import type { CtStartState } from './ct-start-state.type';
import { LEGACY_PARTY } from './legacy-party.constants';
import { planEarlyFlagsSplice } from './plan-early-flags-splice';
import { planStartState } from './plan-start-state';

const planStartSplices = (state: CtStartState, party: CtStartParty = LEGACY_PARTY): ScriptSplice[] => {
  const early = planEarlyFlagsSplice(state, party);
  return [...(early === null ? [] : [early]), planStartState(state, party)];
};

export { planStartSplices };
