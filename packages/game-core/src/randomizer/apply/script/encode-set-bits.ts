/* @layer bridge-wasm @kind logic */
import { FLAG_BASE, FLAG_BYTES, FLAG_PAGE_BIT, FLAG_PAGE_BYTES, OP_SET_GLOBAL_BIT } from './script-ops.constants';

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

export { encodeSetBits };
