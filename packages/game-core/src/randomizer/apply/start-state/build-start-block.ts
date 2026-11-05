/* @layer bridge-wasm @kind logic */
import { encodeClearBits } from '../script/encode-clear-bits';
import { encodeJoin } from '../script/encode-join';
import { encodePoke } from '../script/encode-poke';
import { encodeReserveAdd } from '../script/encode-reserve-add';
import { encodeSetBits } from '../script/encode-set-bits';
import { retargetChangeLocation } from '../script/retarget-change-location';
import type { CtStartState } from './ct-start-state.type';

const buildStartBlock = (state: CtStartState, anchorOp: Uint8Array): Uint8Array => {
  const parts = [
    ...state.flags.map((f) => encodeSetBits(f.at, f.bits)),
    ...state.pokes.map((p) => encodePoke(p.at, p.value, p.width)),
    ...state.party.join.flatMap((id) => [encodeReserveAdd(id), encodeJoin(id)]),
    ...(state.clear ?? []).map((f) => encodeClearBits(f.at, f.bits)),
    retargetChangeLocation(anchorOp, state.warp.location, state.warp.x, state.warp.y),
  ];
  return Uint8Array.from(parts.flatMap((part) => [...part]));
};

export { buildStartBlock };
