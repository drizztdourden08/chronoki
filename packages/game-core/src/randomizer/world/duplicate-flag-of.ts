/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from './ct-placement.type';
import type { CtOptionValues } from './ct-world-input.type';
import type { CharacterAssignment } from './recruits/character-assignment.type';

const duplicateFlagOf = (options: CtOptionValues, characters: CharacterAssignment | undefined): Pick<CtPlacement, 'duplicateCharacters'> =>
  characters !== undefined && options.duplicateCharacters === true ? { duplicateCharacters: true } : {};

export { duplicateFlagOf };
