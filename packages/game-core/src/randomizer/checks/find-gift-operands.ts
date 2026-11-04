/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES, OP_ADD_ITEM } from './gift-ops.constants';
import { measureOpLength } from './measure-op-length';
import type { FunctionStart, WalkRange } from './find-gift-operands.type';
import type { GiftOperand } from './read-pack-entries.type';

const functionStarts = (raw: Uint8Array, header: number, bodyLength: number): FunctionStart[] => {
  const starts = new Map<number, number>();
  for (let k = 0; k < (raw[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const a = ((raw[1 + k * 2] ?? 0) | ((raw[2 + k * 2] ?? 0) << 8)) - header;
    if (a >= 0 && a < bodyLength && !starts.has(a)) starts.set(a, Math.floor(k / OBJECT_FUNCTIONS));
  }
  return [...starts].map(([from, object]) => ({ from, object })).sort((x, y) => x.from - y.from);
};

const walkRange = (body: Uint8Array, range: WalkRange, header: number): GiftOperand[] => {
  const found: GiftOperand[] = [];
  for (let a = range.from; a < range.to; ) {
    const n = measureOpLength(body, a);
    if (n === 0 || a + n > body.length) break;
    if (body[a] === OP_ADD_ITEM) {
      found.push({ patchAt: 1 + header + a + 1, item: body[a + 1] ?? 0, object: range.object });
    }
    a += n;
  }
  return found;
};

const findGiftOperands = (raw: Uint8Array): GiftOperand[] => {
  const header = (raw[0] ?? 0) * OBJECT_HEADER_BYTES;
  const body = raw.subarray(1 + header);
  const starts = functionStarts(raw, header, body.length);
  const found = new Map<number, GiftOperand>();
  starts.forEach(({ from, object }, k) => {
    const range = { from, object, to: starts[k + 1]?.from ?? body.length };
    walkRange(body, range, header).forEach((g) => found.set(g.patchAt, g));
  });
  return [...found.values()].sort((x, y) => x.patchAt - y.patchAt);
};

export { findGiftOperands };
