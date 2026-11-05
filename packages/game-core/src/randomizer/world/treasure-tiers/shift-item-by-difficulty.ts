/* @layer bridge-wasm @kind logic */
import { isKeyId, tierPoolOf } from './tier-pool-of';
import { tierSlotOf } from './tier-slot-of';
import { DIFFICULTY_TIER_SHIFT, TIER_COUNT } from './treasure-tiers.constants';
import type { ItemDifficulty, TreasureTier } from './treasure-tier.type';

const hashOf = (text: string): number =>
  [...text].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);

const shiftItemByDifficulty = (item: number, difficulty: ItemDifficulty, salt: string): number => {
  const slot = tierSlotOf(item);
  if (!slot || isKeyId(item)) return item;
  const tier = Math.min(TIER_COUNT - 1, Math.max(0, slot.tier + DIFFICULTY_TIER_SHIFT[difficulty])) as TreasureTier;
  const pool = tierPoolOf({ group: slot.group, tier });
  return pool.length === 0 ? item : (pool[hashOf(`${salt}:${item}`) % pool.length] ?? item);
};

export { shiftItemByDifficulty };
