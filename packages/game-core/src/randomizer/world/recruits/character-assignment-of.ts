/* @layer bridge-wasm @kind logic */
import { modeOf } from '../modes/mode-of';
import type { CharacterAssignment } from './character-assignment.type';
import { keepRequiredRecruits } from './keep-required-recruits';
import { rollDuplicateAssignment } from './roll-duplicate-assignment';
import { rollRecruitAssignment } from './roll-recruit-assignment';

const characterAssignmentOf = (
  options: Readonly<Record<string, unknown>> | undefined,
  seed: string,
): CharacterAssignment | undefined => {
  if (options?.characterRando !== true) return undefined;
  if (options.duplicateCharacters === true) return rollDuplicateAssignment(seed);
  return keepRequiredRecruits(rollRecruitAssignment(seed), modeOf(options));
};

export { characterAssignmentOf };
