/* @layer bridge-wasm @kind logic */
import type { CtStartParty } from '../../world/party/ct-party.type';
import { partyIdsOf } from '../../world/party/party-ids-of';
import { encodeClearBits } from '../script/encode-clear-bits';
import { encodePoke } from '../script/encode-poke';
import { encodeSetBits } from '../script/encode-set-bits';
import { retargetChangeLocation } from '../script/retarget-change-location';
import type { CtStartState } from './ct-start-state.type';
import { partyPokes } from './party-pokes';
import { CT_RECRUIT_FLAGS } from './recruit-flags.constants';

const buildStartBlock = (state: CtStartState, party: CtStartParty, anchorOp: Uint8Array): Uint8Array => {
  const parts = [
    ...[...state.flags, ...party.flatMap((id) => CT_RECRUIT_FLAGS[id])].map((f) => encodeSetBits(f.at, f.bits)),
    ...[...state.pokes, ...partyPokes(partyIdsOf(party))].map((p) => encodePoke(p.at, p.value, p.width)),
    ...(state.clear ?? []).map((f) => encodeClearBits(f.at, f.bits)),
    retargetChangeLocation(anchorOp, state.warp.location, state.warp.x, state.warp.y),
  ];
  return Uint8Array.from(parts.flatMap((part) => [...part]));
};

export { buildStartBlock };
