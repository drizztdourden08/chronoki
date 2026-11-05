/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtCharacter } from '../../world/ct-world-keys.type';
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from '../../world/recruits/character-rando.constants';
import { characterAssignmentOf } from '../../world/recruits/character-assignment-of';
import { rollRecruitAssignment } from '../../world/recruits/roll-recruit-assignment';
import type { PackEdit } from '../apply-seed.type';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { findSceneScript } from '../script/find-scene-script';
import { planRecruitSwapEdits } from './plan-recruit-swap-edits';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { syntheticRecruitPack } from './recruit-rando.fixture';
import { scriptOf } from './script-of.fixture';

const spots = CHARACTER_RANDO_SPOTS;
const rotated: CharacterAssignment = Object.fromEntries(spots.map((s, i) => [s, spots[(i + 1) % spots.length] ?? s]));
const identity: CharacterAssignment = Object.fromEntries(spots.map((s) => [s, s]));

const applied = (pack: Uint8Array, edits: readonly PackEdit[]): Uint8Array => {
  const out = pack.slice();
  edits.forEach((e) => {
    expect(pack[e.at]).toBe(e.old);
    out[e.at] = e.next;
  });
  return out;
};

const scriptBytes = (pack: Uint8Array, scene: number): number[] => {
  const script = findSceneScript(pack, scene);
  return [...pack.subarray(script?.start ?? 0, (script?.start ?? 0) + (script?.length ?? 0))];
};

const expectScenesRewritten = (edited: Uint8Array, spot: CtCharacter, scenes: readonly number[]): void => {
  const holder = rotated[spot] ?? spot;
  scenes.forEach((scene) => expect(scriptBytes(edited, scene)).toEqual(scriptOf(spot, holder)));
};

describe('recruit assignment', { tags: ['critical'] }, () => {
  it('is a permutation of the spots, the same for the same seed', () => {
    const a = rollRecruitAssignment('seed-a');
    expect(Object.keys(a).sort()).toEqual([...spots].sort());
    expect(Object.values(a).sort()).toEqual([...spots].sort());
    expect(rollRecruitAssignment('seed-a')).toEqual(a);
    const others = ['b', 'c', 'd', 'e', 'f'].map((s) => rollRecruitAssignment(`seed-${s}`));
    expect(others.some((o) => JSON.stringify(o) !== JSON.stringify(a))).toBe(true);
  });

  it('exists only when the option is on and reaches the apply options with a seed', () => {
    expect(characterAssignmentOf({ characterRando: false }, 's')).toBeUndefined();
    expect(characterAssignmentOf({}, 's')).toBeUndefined();
    expect(applyOptionsOf({}, [], 's').characterRando).toBeUndefined();
    expect(applyOptionsOf({ characterRando: true }, [], 's').characterRando).toEqual(rollRecruitAssignment('s'));
    expect(applyOptionsOf({ characterRando: true }, []).characterRando).toBeUndefined();
  });

  it('feeds duplicateCharacters to the apply options only together with characterRando', () => {
    expect(applyOptionsOf({ characterRando: true, duplicateCharacters: true }, [], 's').duplicateCharacters).toBe(true);
    expect(applyOptionsOf({ duplicateCharacters: true }, [], 's').duplicateCharacters).toBeUndefined();
    expect(applyOptionsOf({ characterRando: true }, [], 's').duplicateCharacters).toBeUndefined();
  });
});

describe('recruit swap edits', { tags: ['critical'] }, () => {
  it('rewrites joins, loaders and tests of the spot object to the new character, nothing else', () => {
    const pack = syntheticRecruitPack();
    const plan = planRecruitSwapEdits(pack, rotated);
    expect(plan.failed).toEqual([]);
    const edited = applied(pack, plan.edits);
    (Object.entries(RECRUIT_SPOT_SCENES) as [CtCharacter, readonly number[]][]).forEach(([spot, scenes]) =>
      expectScenesRewritten(edited, spot, scenes),
    );
  });

  it('changes no byte for the identity assignment, even without the scenes', () => {
    expect(planRecruitSwapEdits(syntheticRecruitPack(), identity)).toEqual({ edits: [], failed: [] });
    expect(planRecruitSwapEdits(new Uint8Array(12), identity)).toEqual({ edits: [], failed: [] });
  });

  it('swaps one pair only', () => {
    const pack = syntheticRecruitPack();
    const plan = planRecruitSwapEdits(pack, { ...identity, robo: 'frog', frog: 'robo' });
    const edited = applied(pack, plan.edits);
    expect(scriptBytes(edited, 0x0e2)).toEqual(scriptOf('robo', 'frog'));
    expect(scriptBytes(edited, 0x081)).toEqual(scriptOf('frog', 'robo'));
    expect(scriptBytes(edited, 0x1b7)).toEqual(scriptOf('marle', 'marle'));
  });

  it('refuses a spot whose scene is missing', () => {
    const plan = planRecruitSwapEdits(syntheticRecruitPack(0x0e2), rotated);
    expect(plan.failed).toEqual(['character-rando: robo recruit ops not found in scene e2']);
  });
});
