/* @layer bridge-wasm @kind logic */
import { modeOf } from '../modes/mode-of';
import type { CharacterAssignment } from './character-assignment.type';
import { keepRequiredRecruits } from './keep-required-recruits';
import { rollRecruitAssignment } from './roll-recruit-assignment';

const characterAssignmentOf = (
  options: Readonly<Record<string, unknown>> | undefined,
  seed: string,
): CharacterAssignment | undefined => (options?.characterRando === true
  ? keepRequiredRecruits(rollRecruitAssignment(seed), modeOf(options))
  : undefined);

export { characterAssignmentOf };
