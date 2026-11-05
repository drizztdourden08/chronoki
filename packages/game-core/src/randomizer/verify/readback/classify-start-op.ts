/* @layer bridge-wasm @kind logic */
import { JOINED_MASK, ROSTER, ROSTER_SLOTS } from '../../apply/start-state/party-pokes.constants';
import type { DecodedOp, MismatchKind } from './readback.type';

type StartOpClass = { kind: MismatchKind; location: string };

const hex = (value: number): string => value.toString(16);

const classifyStartOp = (op: DecodedOp): StartOpClass => {
  if (op.kind === 'warp') return { kind: 'warp', location: `warp-${hex(op.address)}` };
  if (op.kind === 'set-bit' || op.kind === 'reset-bit') {
    return { kind: 'flag', location: `${op.kind}-${hex(op.address)}-${hex(op.value)}` };
  }
  if (op.address >= ROSTER && op.address < ROSTER + ROSTER_SLOTS) return { kind: 'roster', location: `slot-${op.address - ROSTER}` };
  if (op.address === JOINED_MASK) return { kind: 'joined', location: 'joined-mask' };
  return { kind: 'start-poke', location: `poke-${hex(op.address)}` };
};

export { classifyStartOp };
