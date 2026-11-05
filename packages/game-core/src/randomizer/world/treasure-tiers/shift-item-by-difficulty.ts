/* @layer bridge-wasm @kind logic */
import { poolKeyOf } from './pool-key-of';
import { DIFFICULTY_TIER_SHIFT, TIER_COUNT } from './treasure-tiers.constants';
import type { ItemDifficulty, TierTable, TreasureTier } from './treasure-tier.type';

const hashOf = (text: string): number =>
  [...text].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);

const shiftItemByDifficulty = (table: TierTable, item: number, difficulty: ItemDifficulty, salt: string): number => {
  const slot = table.slots.get(item);
  if (!slot) return item;
  const tier = Math.min(TIER_COUNT - 1, Math.max(0, slot.tier + DIFFICULTY_TIER_SHIFT[difficulty])) as TreasureTier;
  const pool = table.pools.get(poolKeyOf(slot.kind, tier)) ?? [];
  return pool.length === 0 ? item : (pool[hashOf(`${salt}:${item}`) % pool.length] ?? item);
};

export { shiftItemByDifficulty };
