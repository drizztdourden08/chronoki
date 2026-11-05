/* @layer bridge-wasm @kind logic */
import type { ElementAssignment } from './element-rando.type';
import { rollElementAssignment } from './roll-element-assignment';

const elementAssignmentOf = (options: Readonly<Record<string, unknown>> | undefined, seed: string): ElementAssignment | undefined =>
  options?.elementRando === true ? rollElementAssignment(seed) : undefined;

export { elementAssignmentOf };
