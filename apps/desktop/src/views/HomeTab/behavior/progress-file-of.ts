/* @layer renderer-components @kind logic */
import type { SramSlotSummary } from '@chronoki/game-core';
import type { HeroProgressFile } from '@app/compounds/ProfileHero';

const progressFileOf = (summary: SramSlotSummary): HeroProgressFile => ({
  slot: summary.slot,
  lead: `Character ${summary.leadId + 1}`,
  level: summary.level,
  playTime: `${summary.hours}h ${String(summary.minutes).padStart(2, '0')}m`,
  saveNumber: summary.saveNumber,
});

export { progressFileOf };
