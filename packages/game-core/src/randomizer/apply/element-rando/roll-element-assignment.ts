/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { ELEMENT_RANDO_STREAM, ELEMENTS, MAGIC_USERS } from './element-rando.constants';
import type { Element, ElementAssignment, ElementCharacter } from './element-rando.type';

const rollElementAssignment = (seed: string): ElementAssignment => {
  const rng = createRng(`${seed}${ELEMENT_RANDO_STREAM}`);
  const doubled = ELEMENTS[rng.int(ELEMENTS.length)] ?? 'water';
  const dealt = rng.shuffle([...ELEMENTS, doubled]);
  const characters = Object.fromEntries(MAGIC_USERS.map((user, i) => [user, dealt[i] ?? 'water'])) as Record<ElementCharacter, Element>;
  const [first = 'shadow', second = 'fire', third = 'lightning'] = rng.shuffle(ELEMENTS.filter((element) => element !== doubled));
  return { characters, robo: [first, second, third] };
};

export { rollElementAssignment };
