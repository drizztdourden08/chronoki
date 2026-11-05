/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from '../../checks/gift-ops.constants';
import { measureOpLength } from '../../checks/measure-op-length';
import type { ScriptOp } from './script-splice.type';

const pointerAt = (raw: Uint8Array, k: number): number => (raw[1 + k * 2] ?? 0) | ((raw[2 + k * 2] ?? 0) << 8);

const functionStarts = (raw: Uint8Array): number[] => {
  const header = (raw[0] ?? 0) * OBJECT_HEADER_BYTES;
  const starts = new Set<number>();
  for (let k = 0; k < (raw[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const p = pointerAt(raw, k);
    if (p >= header && p < raw.length - 1) starts.add(p);
  }
  return [...starts].sort((a, b) => a - b);
};

/** Every op reachable by walking each function from its start; positions are script coordinates (raw index - 1). */
const listScriptOps = (raw: Uint8Array): ScriptOp[] => {
  const starts = functionStarts(raw);
  const ops: ScriptOp[] = [];
  starts.forEach((from, k) => {
    const to = starts[k + 1] ?? raw.length - 1;
    for (let a = from; a < to; ) {
      const length = measureOpLength(raw, a + 1);
      if (length === 0 || a + length > raw.length - 1) break;
      ops.push({ at: a, length });
      a += length;
    }
  });
  return ops;
};

export { listScriptOps, pointerAt };
