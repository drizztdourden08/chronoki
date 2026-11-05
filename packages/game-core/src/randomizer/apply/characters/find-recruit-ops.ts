/* @layer bridge-wasm @kind logic */
import { walkScriptOps } from '../../../script-walk/walk-script-ops';
import type { ScriptOpAt } from '../../../script-walk/walk-script-ops.type';
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { findSceneScript } from '../script/find-scene-script';
import { ANCHOR_OPS, CHARACTER_IDS, FIXED_LOADER_OPS, OPERAND_OPS } from './recruit-spot-edits.constants';
import type { RecruitOp } from './recruit-op.type';

const operandOf = (raw: Uint8Array, op: ScriptOpAt): number => raw[op.at + 1] ?? -1;

const namesOperand = (raw: Uint8Array, op: ScriptOpAt, id: number, ops: readonly number[]): boolean =>
  ops.includes(op.op) && operandOf(raw, op) === id;

const findRecruitOps = (pack: Uint8Array, scene: number, spot: CtCharacter): RecruitOp[] | null => {
  const script = findSceneScript(pack, scene);
  if (!script) return null;
  const raw = pack.subarray(script.start, script.start + script.length);
  const id = CHARACTER_IDS[spot];
  const all = walkScriptOps(raw);
  const objects = new Set(all.filter((op) => namesOperand(raw, op, id, ANCHOR_OPS)).map((op) => op.object));
  const ops = all.flatMap((op): RecruitOp[] => {
    if (!objects.has(op.object)) return [];
    if (op.op === FIXED_LOADER_OPS[spot]) return [{ at: script.start + op.at, kind: 'opcode', old: op.op, object: op.object }];
    return namesOperand(raw, op, id, OPERAND_OPS)
      ? [{ at: script.start + op.at + 1, kind: 'operand', old: id, object: op.object }]
      : [];
  });
  return ops.length === 0 ? null : ops;
};

export { findRecruitOps };
