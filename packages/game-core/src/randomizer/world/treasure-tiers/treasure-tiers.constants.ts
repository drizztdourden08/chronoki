/* @layer bridge-wasm @kind constants */
import type { ItemDifficulty } from './treasure-tier.type';

const TIER_COUNT = 3;

const DIFFICULTY_TIER_SHIFT: Readonly<Record<ItemDifficulty, number>> = { easy: 1, normal: 0, hard: -1 };

const HARD_START_GOLD = 10000;

const CLASS_BOUNDS_ROM = 0x288a7;
const RECORD_BASE_ROM = 0x3fcf0e;
const RECORD_STRIDE_ROM = 0x3fcf18;
const POWER_BASE_ROM = 0x3fcf1d;
const POWER_STRIDE_ROM = 0x3fcf27;
const ITEM_PAGE_ROM = 0x0c0000;
const LAST_ITEM_ID = 0xf1;
const LAST_CLASS = 4;
const POWER_CLASSES = 3;
const RECORD_PRICE_AT = 1;
const RECORD_MASK_AT = 3;
const CLASS_KINDS: readonly string[] = ['weapon', 'armor', 'helm', 'accessory', 'consumable'];

export {
  CLASS_BOUNDS_ROM, CLASS_KINDS, DIFFICULTY_TIER_SHIFT, HARD_START_GOLD, ITEM_PAGE_ROM, LAST_CLASS, LAST_ITEM_ID,
  POWER_BASE_ROM, POWER_CLASSES, POWER_STRIDE_ROM, RECORD_BASE_ROM, RECORD_MASK_AT, RECORD_PRICE_AT, RECORD_STRIDE_ROM,
  TIER_COUNT,
};
