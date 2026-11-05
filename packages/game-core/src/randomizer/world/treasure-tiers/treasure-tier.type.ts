/* @layer bridge-wasm @kind type */
type ItemDifficulty = 'easy' | 'normal' | 'hard';

type TreasureTier = 0 | 1 | 2;

type ItemGroup = { first: number; last: number };

type TierSlot = { group: ItemGroup; tier: TreasureTier };

export type { ItemDifficulty, ItemGroup, TierSlot, TreasureTier };
