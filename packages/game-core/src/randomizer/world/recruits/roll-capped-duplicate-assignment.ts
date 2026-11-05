/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CtCharacter } from '../ct-world-keys.type';
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_DUPLICATE_STREAM, CHARACTER_FIXED_SLOTS, CHARACTER_KINDS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';
import type { DuplicateRule } from './duplicate-rule.type';

const rollCappedDuplicateAssignment = (seed: string, rule: DuplicateRule): CharacterAssignment => {
  const rng = createRng(`${seed}${CHARACTER_DUPLICATE_STREAM}`);
  const cap = rule.cap ?? CHARACTER_KINDS.length;
  const spots = rule.allSlots === true ? [...CHARACTER_RANDO_SPOTS, ...CHARACTER_FIXED_SLOTS] : CHARACTER_RANDO_SPOTS;
  const counts = new Map<CtCharacter, number>(rule.allSlots === true ? [] : CHARACTER_FIXED_SLOTS.map((slot) => [slot, 1]));
  const assignment: Partial<Record<CtCharacter, CtCharacter>> = {};
  spots.forEach((spot) => {
    const open = CHARACTER_KINDS.filter((kind) => (counts.get(kind) ?? 0) < cap);
    const kind = open[rng.int(open.length)] ?? spot;
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
    assignment[spot] = kind;
  });
  return assignment;
};

export { rollCappedDuplicateAssignment };
