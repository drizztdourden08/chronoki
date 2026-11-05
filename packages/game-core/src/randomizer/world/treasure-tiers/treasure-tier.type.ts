/* @layer bridge-wasm @kind type */
type ItemDifficulty = 'easy' | 'normal' | 'hard';

type TreasureTier = 0 | 1 | 2;

type ItemStat = { id: number; kind: string; score: number };

type ItemRecordRef = { cls: number; index: number; record: number };

type TierSlot = { kind: string; tier: TreasureTier };

type TierTable = { slots: ReadonlyMap<number, TierSlot>; pools: ReadonlyMap<string, readonly number[]> };

export type { ItemDifficulty, ItemRecordRef, ItemStat, TierSlot, TierTable, TreasureTier };
