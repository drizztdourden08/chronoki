/* @layer bridge-wasm @kind constants */
import type { ItemDifficulty, ItemGroup } from './treasure-tier.type';

const TIER_COUNT = 3;

const TREASURE_GROUPS: readonly ItemGroup[] = [
  { first: 0x01, last: 0x59 },
  { first: 0x5a, last: 0xbc },
  { first: 0xbd, last: 0xd5 },
];

const DIFFICULTY_TIER_SHIFT: Readonly<Record<ItemDifficulty, number>> = { easy: 1, normal: 0, hard: -1 };

const HARD_START_GOLD = 10000;

export { DIFFICULTY_TIER_SHIFT, HARD_START_GOLD, TIER_COUNT, TREASURE_GROUPS };
