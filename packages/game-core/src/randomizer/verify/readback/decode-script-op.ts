/* @layer bridge-wasm @kind logic */
import { changeLocationTarget } from '../../apply/script/change-location-target';
import {
  CHANGE_LOCATION_OPS, FLAG_BASE, FLAG_PAGE_BIT, FLAG_PAGE_BYTES, OP_POKE_BYTE, OP_POKE_WORD, OP_RESET_GLOBAL_BIT,
  OP_SET_GLOBAL_BIT,
} from '../../apply/script/script-ops.constants';
import type { DecodedOp } from './readback.type';

const flagOp = (kind: 'set-bit' | 'reset-bit', op: Uint8Array): DecodedOp => {
  const bit = (op[1] ?? 0) & 0x07;
  const page = (op[1] ?? 0) & FLAG_PAGE_BIT ? FLAG_PAGE_BYTES : 0;
  return { kind, address: FLAG_BASE + page + (op[2] ?? 0), value: 1 << bit };
};

const decodeScriptOp = (op: Uint8Array): DecodedOp => {
  const code = op[0] ?? 0;
  if (code === OP_POKE_BYTE || code === OP_POKE_WORD) {
    const address = (op[1] ?? 0) | ((op[2] ?? 0) << 8) | ((op[3] ?? 0) << 16);
    const value = (op[4] ?? 0) | (code === OP_POKE_WORD ? (op[5] ?? 0) << 8 : 0);
    return { kind: 'poke', address, value };
  }
  if (code === OP_SET_GLOBAL_BIT) return flagOp('set-bit', op);
  if (code === OP_RESET_GLOBAL_BIT) return flagOp('reset-bit', op);
  if (CHANGE_LOCATION_OPS.includes(code)) return { kind: 'warp', address: changeLocationTarget(op), value: op[3] ?? 0 };
  return { kind: 'other', address: 0, value: code };
};

export { decodeScriptOp };
