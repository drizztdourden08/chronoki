/* @layer bridge-wasm @kind logic */
import { fixOneJump } from './fix-one-jump';
import type { ScriptOp, SpliceShift } from './script-splice.type';

const fixScriptJumps = (old: Uint8Array, next: Uint8Array, ops: ScriptOp[], shift: SpliceShift): string[] =>
  ops.map((op) => fixOneJump(old, next, op, shift)).filter((f): f is string => f !== null);

export { fixScriptJumps };
