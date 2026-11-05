/* @layer bridge-wasm @kind logic */
import type { BossAssignment } from './boss-rando.type';
import { rollBossAssignment } from './roll-boss-assignment';

const bossAssignmentOf = (options: Readonly<Record<string, unknown>> | undefined, seed: string): BossAssignment | undefined =>
  options?.bossRando === true ? rollBossAssignment(seed) : undefined;

export { bossAssignmentOf };
