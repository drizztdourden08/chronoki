/* @layer bridge-wasm @kind logic */
import { changeLocationTarget } from '../../apply/script/change-location-target';
import {
  CHANGE_LOCATION_OPS, FLAG_BASE, FLAG_PAGE_BIT, FLAG_PAGE_BYTES, OP_POKE_BYTE, OP_POKE_WORD, OP_RESET_GLOBAL_BIT,
  OP_SET_GLOBAL_BIT,
} from '../../apply/script/script-ops.constants';
import type { DecodedOp } from './readback.type';

const byteAt = (op: Uint8Array, i: number): number => op[i] ?? 0;

const flagOp = (kind: 'set-bit' | 'reset-bit', op: Uint8Array): DecodedOp => {
  const page = byteAt(op, 1) & FLAG_PAGE_BIT ? FLAG_PAGE_BYTES : 0;
  return { kind, address: FLAG_BASE + page + byteAt(op, 2), value: 1 << (byteAt(op, 1) & 0x07) };
};

const pokeOp = (op: Uint8Array): DecodedOp => {
  const address = byteAt(op, 1) | (byteAt(op, 2) << 8) | (byteAt(op, 3) << 16);
  const high = byteAt(op, 0) === OP_POKE_WORD ? byteAt(op, 5) << 8 : 0;
  return { kind: 'poke', address, value: byteAt(op, 4) | high };
};

const decodeScriptOp = (op: Uint8Array): DecodedOp => {
  const code = byteAt(op, 0);
  if (code === OP_POKE_BYTE || code === OP_POKE_WORD) return pokeOp(op);
  if (code === OP_SET_GLOBAL_BIT) return flagOp('set-bit', op);
  if (code === OP_RESET_GLOBAL_BIT) return flagOp('reset-bit', op);
  if (CHANGE_LOCATION_OPS.includes(code)) return { kind: 'warp', address: changeLocationTarget(op), value: byteAt(op, 3) };
  return { kind: 'other', address: 0, value: code };
};

export { decodeScriptOp };
