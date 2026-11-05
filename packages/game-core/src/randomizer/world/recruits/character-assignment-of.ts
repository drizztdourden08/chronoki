/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from './character-assignment.type';
import { rollRecruitAssignment } from './roll-recruit-assignment';

const characterAssignmentOf = (
  options: Readonly<Record<string, unknown>> | undefined,
  seed: string,
): CharacterAssignment | undefined => (options?.characterRando === true ? rollRecruitAssignment(seed) : undefined);

export { characterAssignmentOf };
