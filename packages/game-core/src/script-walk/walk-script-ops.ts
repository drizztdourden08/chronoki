/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from '../randomizer/checks/gift-ops.constants';
import { measureOpLength } from '../randomizer/checks/measure-op-length';
import type { FunctionStartAt, ScriptOpAt } from './walk-script-ops.type';

const functionStarts = (raw: Uint8Array, header: number, bodyLength: number): FunctionStartAt[] => {
  const starts = new Map<number, FunctionStartAt>();
  for (let k = 0; k < (raw[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const a = ((raw[1 + k * 2] ?? 0) | ((raw[2 + k * 2] ?? 0) << 8)) - header;
    if (a >= 0 && a < bodyLength && !starts.has(a)) {
      starts.set(a, { from: a, object: Math.floor(k / OBJECT_FUNCTIONS), fn: k % OBJECT_FUNCTIONS });
    }
  }
  return [...starts.values()].sort((x, y) => x.from - y.from);
};

const walkScriptOps = (raw: Uint8Array): ScriptOpAt[] => {
  const header = (raw[0] ?? 0) * OBJECT_HEADER_BYTES;
  const body = raw.subarray(1 + header);
  const starts = functionStarts(raw, header, body.length);
  const found: ScriptOpAt[] = [];
  starts.forEach(({ from, object, fn }, k) => {
    const to = starts[k + 1]?.from ?? body.length;
    for (let a = from; a < to; ) {
      const length = measureOpLength(body, a);
      if (length === 0 || a + length > body.length) break;
      found.push({ object, fn, at: 1 + header + a, op: body[a] ?? 0, length });
      a += length;
    }
  });
  return found;
};

export { walkScriptOps };
