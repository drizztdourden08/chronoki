/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_LABELS } from './character-labels.constants';
import { CHARACTER_RANDO_SPOTS } from './character-rando.constants';

const characterRowsOf = (characters: CharacterAssignment | undefined): { label: string; value: string }[] =>
  characters === undefined
    ? []
    : CHARACTER_RANDO_SPOTS.map((spot) => ({
        label: `Recruit at ${CHARACTER_LABELS[spot]}'s spot`,
        value: CHARACTER_LABELS[characters[spot] ?? spot],
      }));

export { characterRowsOf };
