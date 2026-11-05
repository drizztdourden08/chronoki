/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtRegionSpec } from '../ct-region-spec.type';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyStartPartyToRegions } from './apply-start-party-to-regions';
import type { CharacterAssignment } from './character-assignment.type';
import { characterAssignmentOf } from './character-assignment-of';
import { CHARACTER_KINDS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';
import { characterRowsOf } from './character-rows-of';
import { LEGACY_PARTY } from './legacy-party.constants';
import { rollDuplicateAssignment } from './roll-duplicate-assignment';
import { rollRecruitAssignment } from './roll-recruit-assignment';

const eventIdsOf = (specs: readonly CtRegionSpec[]): string[] => specs.flatMap((s) => s.events.map((e) => e.id));

describe('duplicate character roll', { tags: ['critical'] }, () => {
  it('is deterministic per seed and draws a known kind for each of the five spots', () => {
    expect(rollDuplicateAssignment('a')).toEqual(rollDuplicateAssignment('a'));
    const roll = rollDuplicateAssignment('a');
    expect(Object.keys(roll).sort()).toEqual([...CHARACTER_RANDO_SPOTS].sort());
    for (const kind of Object.values(roll)) expect(CHARACTER_KINDS).toContain(kind);
  });

  it('repeats kinds for some seed and differs between seeds', () => {
    const rolls = Array.from({ length: 40 }, (_, n) => rollDuplicateAssignment(`dup-${n}`));
    const kindCount = (roll: CharacterAssignment): number => new Set(Object.values(roll)).size;
    expect(rolls.some((roll) => kindCount(roll) < 5)).toBe(true);
    expect(new Set(rolls.map((roll) => JSON.stringify(roll))).size).toBeGreaterThan(1);
  });

  it('uses its own stream, leaving the shuffle roll untouched', () => {
    const before = rollRecruitAssignment('s');
    rollDuplicateAssignment('s');
    expect(rollRecruitAssignment('s')).toEqual(before);
  });

  it('is only used with both options on; off keeps the shuffle', () => {
    expect(characterAssignmentOf({ duplicateCharacters: true }, 's')).toBeUndefined();
    expect(characterAssignmentOf({ characterRando: true, duplicateCharacters: true }, 's')).toEqual(rollDuplicateAssignment('s'));
    expect(characterAssignmentOf({ characterRando: true }, 's'))
      .toEqual(characterAssignmentOf({ characterRando: true, duplicateCharacters: false }, 's'));
  });

  it('grants the story slot at each spot and words the spoiler row by role', () => {
    const roll = { marle: 'crono', lucca: 'crono', frog: 'crono', robo: 'crono', ayla: 'crono' } as const;
    const specs = applyStartPartyToRegions(CT_REGIONS, 'present', LEGACY_PARTY, { assignment: roll, duplicate: true });
    const ids = eventIdsOf(specs);
    expect(ids).toContain('frog');
    expect(characterRowsOf(roll, true)).toContainEqual({ label: "Recruit at Frog's spot", value: "Crono (Frog's story role)" });
    expect(characterRowsOf(roll)).toContainEqual({ label: "Recruit at Frog's spot", value: 'Crono' });
  });
});
