/* @layer bridge-wasm @kind logic */
import {
  CHANGE_LOCATION_BYTES, CHANGE_LOCATION_OPS, FLAG_BASE, FLAG_BYTES, FLAG_PAGE_BIT, FLAG_PAGE_BYTES, LOCATION_MASK,
  OP_CHANGE_LOCATION_FADE, OP_JOIN, OP_POKE_BYTE, OP_POKE_WORD, OP_RESERVE_ADD, OP_SET_GLOBAL_BIT,
} from './script-ops.constants';

const lo = (v: number): number => v & 0xff;
const mid = (v: number): number => (v >> 8) & 0xff;
const bank = (v: number): number => (v >> 16) & 0xff;

const encodePoke = (at: number, value: number, width: 1 | 2): Uint8Array =>
  width === 1
    ? Uint8Array.of(OP_POKE_BYTE, lo(at), mid(at), bank(at), lo(value))
    : Uint8Array.of(OP_POKE_WORD, lo(at), mid(at), bank(at), lo(value), mid(value));

const encodeSetBits = (at: number, bits: number): Uint8Array => {
  const offset = at - FLAG_BASE;
  if (offset < 0 || offset >= FLAG_BYTES) throw new RangeError(`flag byte outside 0x7F0000-01FF: ${at.toString(16)}`);
  const page = offset >= FLAG_PAGE_BYTES ? FLAG_PAGE_BIT : 0;
  const ops: number[] = [];
  for (let bit = 0; bit < 8; bit += 1) {
    if (bits & (1 << bit)) ops.push(OP_SET_GLOBAL_BIT, bit | page, offset % FLAG_PAGE_BYTES);
  }
  return Uint8Array.from(ops);
};

const encodeReserveAdd = (character: number): Uint8Array => Uint8Array.of(OP_RESERVE_ADD, lo(character));

const encodeJoin = (character: number): Uint8Array => Uint8Array.of(OP_JOIN, lo(character));

const encodeChangeLocation = (location: number, x: number, y: number, op: number = OP_CHANGE_LOCATION_FADE): Uint8Array =>
  Uint8Array.of(op, lo(location), mid(location & LOCATION_MASK), lo(x), lo(y));

const isChangeLocation = (op: Uint8Array): boolean =>
  op.length === CHANGE_LOCATION_BYTES && CHANGE_LOCATION_OPS.includes(op[0] ?? -1);

const changeLocationTarget = (op: Uint8Array): number => ((op[1] ?? 0) | ((op[2] ?? 0) << 8)) & LOCATION_MASK;

export { changeLocationTarget, encodeChangeLocation, encodeJoin, encodePoke, encodeReserveAdd, encodeSetBits, isChangeLocation };
