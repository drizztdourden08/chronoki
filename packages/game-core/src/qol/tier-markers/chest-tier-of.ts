/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../randomizer/checks/create-pack-rom-view.type';
import { isKeyId } from '../../randomizer/world/treasure-tiers/is-key-id';
import type { ChestTier } from './chest-marker.type';
import { itemPriceOf } from './item-price-of';
import { KEY_ITEM_TIER, TIER_BANDS } from './tier-bands.constants';

const chestTierOf = (rom: RomView, item: number): ChestTier => {
  if (isKeyId(item)) return KEY_ITEM_TIER;
  const price = itemPriceOf(rom, item) ?? 0;
  return TIER_BANDS.find((band) => price >= band.minPrice)?.tier ?? 0;
};

export { chestTierOf };
