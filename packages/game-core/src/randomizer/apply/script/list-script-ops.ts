/* @layer bridge-wasm @kind logic */
import { measureOpLength } from '../../checks/measure-op-length';
import { functionStarts } from './function-starts';
import type { ScriptOp } from './script-splice.type';

const walkFunction = (raw: Uint8Array, from: number, to: number): ScriptOp[] | null => {
  const ops: ScriptOp[] = [];
  let a = from;
  while (a < to) {
    const length = measureOpLength(raw, a + 1);
    if (length === 0) return null;
    ops.push({ at: a, length });
    a += length;
  }
  return a === to ? ops : null;
};

const listScriptOps = (raw: Uint8Array): ScriptOp[] | null => {
  const starts = functionStarts(raw);
  const ops: ScriptOp[] = [];
  for (let k = 0; k < starts.length; k += 1) {
    const walked = walkFunction(raw, starts[k] ?? 0, starts[k + 1] ?? raw.length - 1);
    if (!walked) return null;
    ops.push(...walked);
  }
  return ops;
};

export { listScriptOps };
