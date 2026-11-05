/* @layer bridge-wasm @kind logic */
import { findSceneScript } from '../../apply/script/find-scene-script';
import { listScriptOps } from '../../apply/script/list-script-ops';
import { OP_POKE_BYTE } from '../../apply/script/script-ops.constants';
import type { ScriptOp } from '../../apply/script/script-splice.type';
import { LEGACY_PARTY } from '../../apply/start-state/legacy-party.constants';
import { planStartState } from '../../apply/start-state/plan-start-state';
import { ROSTER } from '../../apply/start-state/party-pokes.constants';
import type { CtStartState } from '../../apply/start-state/ct-start-state.type';
import { measureOpLength } from '../../checks/measure-op-length';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { classifyStartOp } from './classify-start-op';
import { decodeScriptOp } from './decode-script-op';
import type { Mismatch } from './readback.type';

const START_SCENE = 0;
const ADDRESS_BYTES = 3;

const walkBlock = (block: Uint8Array): ScriptOp[] => {
  const ops: ScriptOp[] = [];
  for (let at = 0; at < block.length; at += Math.max(1, ops[ops.length - 1]?.length ?? 1)) {
    ops.push({ at, length: Math.max(1, measureOpLength(block, at)) });
  }
  return ops;
};

const isRosterHead = (op: Uint8Array): boolean =>
  op[0] === OP_POKE_BYTE && Array.from({ length: ADDRESS_BYTES }, (_, i) => op[1 + i] === ((ROSTER >> (8 * i)) & 0xff)).every(Boolean);

const missing = (location: string): Mismatch[] => [{ kind: 'start-block', location, expected: null, actual: null, address: -1 }];

const compareStartBlock = (pack: Uint8Array, state: CtStartState, party: CtStartParty = LEGACY_PARTY): Mismatch[] => {
  const script = findSceneScript(pack, START_SCENE);
  if (!script) return missing('scene-0-script');
  const raw = pack.slice(script.start, script.start + script.length);
  const actualOps = listScriptOps(raw);
  if (!actualOps) return missing('scene-0-unwalkable');
  const actual = actualOps.map((op) => raw.subarray(1 + op.at, 1 + op.at + op.length));
  const block = planStartState(state, party).replace;
  const expected = walkBlock(block).map((op) => block.subarray(op.at, op.at + op.length));
  const head = expected.findIndex(isRosterHead);
  const base = actual.findIndex(isRosterHead) - head;
  if (head < 0 || base + head < 0) return missing('roster-head');
  return expected.flatMap((want, i): Mismatch[] => {
    const got = actual[base + i];
    if (got && got.length === want.length && want.every((byte, k) => byte === got[k])) return [];
    const op = decodeScriptOp(want);
    return [{ ...classifyStartOp(op), expected: op.value, actual: got ? decodeScriptOp(got).value : null, address: op.address }];
  });
};

export { compareStartBlock };
