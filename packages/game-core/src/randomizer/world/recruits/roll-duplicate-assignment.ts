/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_DUPLICATE_STREAM, CHARACTER_KINDS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';
import type { DuplicateRule } from './duplicate-rule.type';
import { rollCappedDuplicateAssignment } from './roll-capped-duplicate-assignment';

const rollUncappedAssignment = (seed: string): CharacterAssignment => {
  const rng = createRng(`${seed}${CHARACTER_DUPLICATE_STREAM}`);
  return Object.fromEntries(CHARACTER_RANDO_SPOTS.map((spot) => [spot, CHARACTER_KINDS[rng.int(CHARACTER_KINDS.length)] ?? spot]));
};

const rollDuplicateAssignment = (seed: string, rule: DuplicateRule = {}): CharacterAssignment =>
  rule.cap === undefined && rule.allSlots !== true ? rollUncappedAssignment(seed) : rollCappedDuplicateAssignment(seed, rule);

export { rollDuplicateAssignment };
