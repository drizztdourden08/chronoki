/* @layer bridge-wasm @kind logic */
import { isKeyId } from './is-key-id';
import { poolKeyOf } from './pool-key-of';
import { TIER_COUNT } from './treasure-tiers.constants';
import type { ItemStat, TierSlot, TierTable, TreasureTier } from './treasure-tier.type';

const groupByKind = (stats: readonly ItemStat[]): Map<string, ItemStat[]> => {
  const kinds = new Map<string, ItemStat[]>();
  stats.filter((s) => !isKeyId(s.id)).forEach((s) => kinds.set(s.kind, [...(kinds.get(s.kind) ?? []), s]));
  return kinds;
};

const buildTierTable = (stats: readonly ItemStat[]): TierTable => {
  const slots = new Map<number, TierSlot>();
  const pools = new Map<string, number[]>();
  groupByKind(stats).forEach((list, kind) => {
    const ranked = [...list].sort((a, b) => a.score - b.score || a.id - b.id);
    ranked.forEach((stat, rank) => {
      const tier = Math.floor((rank * TIER_COUNT) / ranked.length) as TreasureTier;
      slots.set(stat.id, { kind, tier });
      const key = poolKeyOf(kind, tier);
      pools.set(key, [...(pools.get(key) ?? []), stat.id]);
    });
  });
  return { slots, pools };
};

export { buildTierTable };
