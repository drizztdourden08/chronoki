/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from '../../world/recruits/character-rando.constants';
import type { PackEdit } from '../apply-seed.type';
import { namedTableOf } from '../tech-order/named-table-of';
import { duplicatePack, synthRecord } from './duplicate-kind.fixture';
import { RECORD_BYTES } from './level-record.constants';
import { planDuplicateKindEdits } from './plan-duplicate-kind-edits';
import { findSceneScript } from '../script/find-scene-script';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { scriptOf } from './script-of.fixture';

const identity: CharacterAssignment = Object.fromEntries(CHARACTER_RANDO_SPOTS.map((s) => [s, s]));

const applied = (pack: Uint8Array, edits: readonly PackEdit[]): Uint8Array => {
  const out = pack.slice();
  edits.forEach((e) => {
    expect(pack[e.at]).toBe(e.old);
    out[e.at] = e.next;
  });
  return out;
};

const recordOf = (pack: Uint8Array, slot: number): Uint8Array => {
  const at = namedTableOf(pack, 'ctCharBase')?.at ?? 0;
  return pack.slice(at + slot * RECORD_BYTES, at + (slot + 1) * RECORD_BYTES);
};

describe('planDuplicateKindEdits', { tags: ['critical'] }, () => {
  it('changes nothing for the identity assignment', () => {
    expect(planDuplicateKindEdits(duplicatePack(), identity)).toEqual({ edits: [], failed: [] });
  });

  it('makes slot 4 a Crono-kind record at the slot level, XP and NEXT', () => {
    const pack = duplicatePack();
    const plan = planDuplicateKindEdits(pack, { ...identity, frog: 'crono' });
    expect(plan.failed).toEqual([]);
    const rec = recordOf(applied(pack, plan.edits), 4);
    const crono = synthRecord(0);
    const frog = synthRecord(4);
    expect(rec[0]).toBe(0);
    expect(rec[1]).toBe(crono[1]);
    expect(rec[0x27]).toBe(crono[0x27]);
    expect(rec[0x12]).toBe(frog[0x12]);
    expect(rec[0x13]).toBe(frog[0x13]);
    expect(rec[0x2b]).toBe(frog[0x2b]);
    expect(rec[0x2f]).toBe(crono[0x2f]);
    expect(Array.from(recordOf(applied(pack, plan.edits), 0))).toEqual(crono);
  });

  it('retargets only the NPC loader operand of the spot scenes', () => {
    const pack = duplicatePack();
    const edited = applied(pack, planDuplicateKindEdits(pack, { ...identity, robo: 'ayla' }).edits);
    const script = findSceneScript(edited, RECRUIT_SPOT_SCENES.robo?.[0] ?? 0);
    const got = Array.from(edited.subarray(script?.start ?? 0, (script?.start ?? 0) + (script?.length ?? 0)));
    const before = scriptOf('robo', 'robo');
    const diff = got.flatMap((b, i) => (b === before[i] ? [] : [i]));
    expect(diff).toHaveLength(1);
    expect(got[(diff[0] ?? 0) - 1]).toBe(0x81);
    expect(got[diff[0] ?? 0]).toBe(5);
  });

  it('reports a missing ctCharBase table', () => {
    const plan = planDuplicateKindEdits(new Uint8Array(12), { ...identity, frog: 'crono' });
    expect(plan.edits).toEqual([]);
    expect(plan.failed.length).toBeGreaterThan(0);
  });
});
