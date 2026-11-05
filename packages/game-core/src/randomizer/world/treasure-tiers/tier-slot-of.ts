/* @layer bridge-wasm @kind logic */
import { TIER_COUNT, TREASURE_GROUPS } from './treasure-tiers.constants';
import type { TierSlot, TreasureTier } from './treasure-tier.type';

const tierSlotOf = (item: number): TierSlot | null => {
  const group = TREASURE_GROUPS.find((g) => item >= g.first && item <= g.last);
  if (!group) return null;
  const size = group.last - group.first + 1;
  return { group, tier: Math.floor(((item - group.first) * TIER_COUNT) / size) as TreasureTier };
};

export { tierSlotOf };
