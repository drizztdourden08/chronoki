/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_DUPLICATE_STREAM, CHARACTER_KINDS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';

const rollDuplicateAssignment = (seed: string): CharacterAssignment => {
  const rng = createRng(`${seed}${CHARACTER_DUPLICATE_STREAM}`);
  return Object.fromEntries(CHARACTER_RANDO_SPOTS.map((spot) => [spot, CHARACTER_KINDS[rng.int(CHARACTER_KINDS.length)] ?? spot]));
};

export { rollDuplicateAssignment };
