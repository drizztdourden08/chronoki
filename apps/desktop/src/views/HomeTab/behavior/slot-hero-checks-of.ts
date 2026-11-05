/* @layer renderer-components @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { decodeSlotChecks } from '@chronoki/game-core';
import type { HeroChecks } from '@app/compounds/ProfileHero';

const slotHeroChecksOf = (bytes: Uint8Array, slot: number, checks: readonly CheckDef[]): HeroChecks | undefined => {
  const decoded = decodeSlotChecks(bytes, slot, checks);
  if (decoded === null) return undefined;
  return { taken: decoded.done.length, available: null, left: checks.length - decoded.done.length, total: checks.length };
};

export { slotHeroChecksOf };
