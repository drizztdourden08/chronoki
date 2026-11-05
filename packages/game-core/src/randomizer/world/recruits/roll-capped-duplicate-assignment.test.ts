/* @layer bridge-wasm @kind test */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import { characterAssignmentOf } from './character-assignment-of';
import { CHARACTER_DUPLICATE_STREAM, CHARACTER_KINDS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';
import { rollDuplicateAssignment } from './roll-duplicate-assignment';

const originalRoll = (seed: string): Record<string, string> => {
  const rng = createRng(`${seed}${CHARACTER_DUPLICATE_STREAM}`);
  return Object.fromEntries(CHARACTER_RANDO_SPOTS.map((spot) => [spot, CHARACTER_KINDS[rng.int(CHARACTER_KINDS.length)] ?? spot]));
};

const copiesOf = (kind: string, values: readonly (string | undefined)[]): number => values.filter((value) => value === kind).length;

describe('duplicate character roll options', { tags: ['critical'] }, () => {
  it('keeps the original draw sequence for the default rule', () => {
    for (let n = 0; n < 50; n += 1) {
      const seed = `def-${n}`;
      expect(rollDuplicateAssignment(seed)).toEqual(originalRoll(seed));
      expect(rollDuplicateAssignment(seed, {})).toEqual(originalRoll(seed));
      const options = { characterRando: true, duplicateCharacters: true, duplicateCap: 'none', duplicateAllSlots: false };
      expect(characterAssignmentOf(options, seed)).toEqual(originalRoll(seed));
    }
  });

  it('never exceeds the cap, counting the fixed Crono and Magus', () => {
    for (const cap of [2, 3]) {
      for (let n = 0; n < 300; n += 1) {
        const roll = rollDuplicateAssignment(`cap-${n}`, { cap });
        expect(Object.keys(roll).sort()).toEqual([...CHARACTER_RANDO_SPOTS].sort());
        const party = [...Object.values(roll), 'crono', 'magus'];
        for (const kind of CHARACTER_KINDS) expect(copiesOf(kind, party)).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('rolls Crono and Magus too with allSlots, still under the cap', () => {
    for (let n = 0; n < 200; n += 1) {
      const roll = rollDuplicateAssignment(`all-${n}`, { cap: 2, allSlots: true });
      expect(Object.keys(roll)).toHaveLength(7);
      expect(roll.crono).toBeDefined();
      expect(roll.magus).toBeDefined();
      for (const kind of CHARACTER_KINDS) expect(copiesOf(kind, Object.values(roll))).toBeLessThanOrEqual(2);
    }
  });

  it('reads the rule from the options', () => {
    const options = { characterRando: true, duplicateCharacters: true, duplicateCap: '2', duplicateAllSlots: true };
    expect(characterAssignmentOf(options, 's')).toEqual(rollDuplicateAssignment('s', { cap: 2, allSlots: true }));
  });
});
