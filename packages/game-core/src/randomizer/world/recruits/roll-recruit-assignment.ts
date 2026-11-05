/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_RANDO_SPOTS, CHARACTER_RANDO_STREAM } from './character-rando.constants';

const rollRecruitAssignment = (seed: string): CharacterAssignment => {
  const shuffled = createRng(`${seed}${CHARACTER_RANDO_STREAM}`).shuffle([...CHARACTER_RANDO_SPOTS]);
  return Object.fromEntries(CHARACTER_RANDO_SPOTS.map((spot, i) => [spot, shuffled[i] ?? spot]));
};

export { rollRecruitAssignment };
