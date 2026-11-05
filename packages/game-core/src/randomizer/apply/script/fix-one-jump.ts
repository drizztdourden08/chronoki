/* @layer bridge-wasm @kind logic */
import { jumpDisplacement } from './jump-displacement';
import { jumpTarget } from './jump-target';
import { mapScriptCoord } from './map-script-coord';
import { JUMP_SPECS } from './script-jumps.constants';
import type { ScriptOp, SpliceShift } from './script-splice.type';

const fixOneJump = (old: Uint8Array, next: Uint8Array, op: ScriptOp, shift: SpliceShift): string | null => {
  const spec = JUMP_SPECS[old[1 + op.at] ?? -1];
  const oldTarget = jumpTarget(old, op);
  if (!spec || oldTarget === null || (op.at >= shift.at && op.at < shift.end)) return null;
  const newBase = (mapScriptCoord(op.at, shift) ?? 0) + spec.dispAt;
  const target = mapScriptCoord(oldTarget, shift);
  if (target === null) return `jump at ${op.at} lands inside the replaced op`;
  const fixed = jumpDisplacement(spec.back, newBase, target);
  if (fixed === null) return `jump at ${op.at} no longer reaches its target`;
  next[1 + newBase] = fixed;
  return null;
};

export { fixOneJump };
