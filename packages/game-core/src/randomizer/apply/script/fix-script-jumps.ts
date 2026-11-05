/* @layer bridge-wasm @kind logic */
import { mapScriptCoord } from './map-script-coord';
import { JUMP_SPECS } from './script-jumps.constants';
import type { ScriptOp, SpliceShift } from './script-splice.type';

const MAX_DISPLACEMENT = 0xff;

/** Re-aims every jump of the original ops in `next` (already spliced); the replaced op itself is skipped. */
const fixScriptJumps = (old: Uint8Array, next: Uint8Array, ops: ScriptOp[], shift: SpliceShift): string[] => {
  const failed: string[] = [];
  ops.forEach((op) => {
    const spec = JUMP_SPECS[old[1 + op.at] ?? -1];
    if (!spec || (op.at >= shift.at && op.at < shift.end)) return;
    const base = op.at + spec.dispAt;
    const disp = old[1 + base] ?? 0;
    const newBase = (mapScriptCoord(op.at, shift) ?? 0) + spec.dispAt;
    const target = mapScriptCoord(spec.back ? base - disp : base + disp, shift);
    if (target === null) {
      failed.push(`jump at ${op.at} lands inside the replaced op`);
      return;
    }
    const fixed = spec.back ? newBase - target : target - newBase;
    if (fixed < 0 || fixed > MAX_DISPLACEMENT) failed.push(`jump at ${op.at} no longer reaches its target`);
    else next[1 + newBase] = fixed;
  });
  return failed;
};

export { fixScriptJumps };
