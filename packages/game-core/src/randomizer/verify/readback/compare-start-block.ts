/* @layer bridge-wasm @kind logic */
import { findSceneScript } from '../../apply/script/find-scene-script';
import { listScriptOps } from '../../apply/script/list-script-ops';
import { OP_POKE_BYTE, OP_POKE_WORD } from '../../apply/script/script-ops.constants';
import type { ScriptOp } from '../../apply/script/script-splice.type';
import type { ByteAt, CtStartState } from '../../apply/start-state/ct-start-state.type';
import { LEGACY_PARTY } from '../../apply/start-state/legacy-party.constants';
import { fitPartyToState } from '../../apply/start-state/fit-party-to-state';
import { planStartState } from '../../apply/start-state/plan-start-state';
import { startBlocksOf } from '../../apply/start-state/start-blocks-of';
import { measureOpLength } from '../../checks/measure-op-length';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { classifyStartOp } from './classify-start-op';
import { decodeScriptOp } from './decode-script-op';
import { START_SCENE } from './readback.constants';
import type { Mismatch } from './readback.type';

const walkBlock = (block: Uint8Array): ScriptOp[] => {
  const ops: ScriptOp[] = [];
  for (let at = 0; at < block.length; at += Math.max(1, ops[ops.length - 1]?.length ?? 1)) {
    ops.push({ at, length: Math.max(1, measureOpLength(block, at)) });
  }
  return ops;
};

const sameOp = (want: Uint8Array, got?: Uint8Array): boolean =>
  got?.length === want.length && want.every((byte, k) => byte === got[k]);

const isPoke = (op?: Uint8Array): boolean => op?.[0] === OP_POKE_BYTE || op?.[0] === OP_POKE_WORD;

const anchorOf = (expected: Uint8Array[], actual: Uint8Array[]): number => {
  const votes = new Map<number, number>();
  expected.forEach((want, i) => actual.forEach((got, j) => {
    if (j >= i && sameOp(want, got)) votes.set(j - i, (votes.get(j - i) ?? 0) + 1);
  }));
  return [...votes].reduce((best, [base, count]) => (count > (votes.get(best) ?? 0) ? base : best), -1);
};

const pokeBytes = (op: Uint8Array): ByteAt[] => {
  const { address, value } = decodeScriptOp(op);
  return op[0] === OP_POKE_WORD ? [[address, value & 0xff], [address + 1, value >> 8]] : [[address, value]];
};

const pokeMismatches = (want: Uint8Array, got: Uint8Array): Mismatch[] => {
  const actual = new Map(pokeBytes(got));
  return pokeBytes(want)
    .filter(([address, value]) => actual.get(address) !== value)
    .map(([address, value]) => ({
      ...classifyStartOp({ kind: 'poke', address, value }), expected: value, actual: actual.get(address) ?? null, address,
    }));
};

const opMismatches = (want: Uint8Array, got?: Uint8Array): Mismatch[] => {
  if (sameOp(want, got)) return [];
  if (got && isPoke(want) && isPoke(got)) return pokeMismatches(want, got);
  const op = decodeScriptOp(want);
  return [{ ...classifyStartOp(op), expected: op.value, actual: got ? decodeScriptOp(got).value : null, address: op.address }];
};

const missing = (location: string): Mismatch[] => [{ kind: 'start-block', location, expected: null, actual: null, address: -1 }];

const compareBlock = (actual: Uint8Array[], block: Uint8Array, location: string): Mismatch[] => {
  const expected = walkBlock(block).map((op) => block.subarray(op.at, op.at + op.length));
  const base = anchorOf(expected, actual);
  if (base < 0) return missing(location);
  return expected.flatMap((want, i) => opMismatches(want, actual[base + i]));
};

const compareStartBlock = (pack: Uint8Array, state: CtStartState, party: CtStartParty = LEGACY_PARTY): Mismatch[] => {
  const script = findSceneScript(pack, START_SCENE);
  if (!script) return missing('scene-0-script');
  const raw = pack.slice(script.start, script.start + script.length);
  const actualOps = listScriptOps(raw);
  if (!actualOps) return missing('scene-0-unwalkable');
  const actual = actualOps.map((op) => raw.subarray(1 + op.at, 1 + op.at + op.length));
  const fitted = fitPartyToState(party, state);
  const { early } = startBlocksOf(state, fitted);
  return [
    ...(early.length === 0 ? [] : compareBlock(actual, early, 'start-block-part-1-anchor')),
    ...compareBlock(actual, planStartState(state, party).replace, 'block-anchor'),
  ];
};

export { compareStartBlock };
