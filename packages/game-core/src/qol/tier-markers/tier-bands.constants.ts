/* @layer bridge-wasm @kind constants */
import type { ChestTier } from './chest-marker.type';

const TIER_BANDS: readonly { tier: ChestTier; minPrice: number }[] = [
  { tier: 3, minPrice: 3000 },
  { tier: 2, minPrice: 500 },
  { tier: 1, minPrice: 1 },
];
const KEY_ITEM_TIER: ChestTier = 4;

export { KEY_ITEM_TIER, TIER_BANDS };
