/* @layer bridge-wasm @kind logic */
import { JUMP_SPECS } from './script-jumps.constants';
import type { ScriptOp } from './script-splice.type';

const jumpTarget = (raw: Uint8Array, op: ScriptOp): number | null => {
  const spec = JUMP_SPECS[raw[1 + op.at] ?? -1];
  if (!spec) return null;
  const base = op.at + spec.dispAt;
  const disp = raw[1 + base] ?? 0;
  return spec.back ? base - disp : base + disp;
};

export { jumpTarget };
