/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS } from '../../checks/gift-ops.constants';
import { functionStarts } from './function-starts';
import { pointerAt } from './pointer-at';
import type { ScriptOp, SpliceScope } from './script-splice.type';

const scopeOps = (raw: Uint8Array, ops: ScriptOp[], scope?: SpliceScope): ScriptOp[] => {
  if (!scope) return ops;
  const k = scope.object * OBJECT_FUNCTIONS + scope.fn;
  if (scope.fn >= OBJECT_FUNCTIONS || scope.object >= (raw[0] ?? 0)) return [];
  const from = pointerAt(raw, k);
  const to = functionStarts(raw).find((s) => s > from) ?? raw.length - 1;
  return ops.filter((o) => o.at >= from && o.at < to);
};

export { scopeOps };
