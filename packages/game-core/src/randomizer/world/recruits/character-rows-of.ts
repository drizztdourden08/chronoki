/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_LABELS } from './character-labels.constants';
import { CHARACTER_FIXED_SLOTS, CHARACTER_RANDO_SPOTS } from './character-rando.constants';

const characterRowsOf = (
  characters: CharacterAssignment | undefined, duplicate = false,
): { label: string; value: string }[] =>
  characters === undefined
    ? []
    : [...CHARACTER_RANDO_SPOTS, ...CHARACTER_FIXED_SLOTS.filter((slot) => characters[slot] !== undefined)].map((spot) => ({
        label: CHARACTER_FIXED_SLOTS.includes(spot) ? `${CHARACTER_LABELS[spot]}'s slot` : `Recruit at ${CHARACTER_LABELS[spot]}'s spot`,
        value: duplicate
          ? `${CHARACTER_LABELS[characters[spot] ?? spot]} (${CHARACTER_LABELS[spot]}'s story role)`
          : CHARACTER_LABELS[characters[spot] ?? spot],
      }));

export { characterRowsOf };
