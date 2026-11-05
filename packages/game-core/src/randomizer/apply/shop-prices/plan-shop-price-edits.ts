/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { PackEdit } from '../apply-seed.type';
import { priceOf } from './price-of';
import { readPriceSlots } from './read-price-slots';
import { SHOP_PRICE_STREAM } from './shop-prices.constants';
import type { PriceSlot, ShopPriceOption } from './shop-prices.type';

const slotEdits = (slot: PriceSlot, next: number): PackEdit[] => {
  const why = `shop-price-${slot.id}`;
  return slot.at
    .flatMap((at) => [
      { at, old: slot.price & 0xff, next: next & 0xff, why },
      { at: at + 1, old: slot.price >> 8, next: next >> 8, why },
    ])
    .filter((edit) => edit.old !== edit.next);
};

const planShopPriceEdits = (pack: Uint8Array, option: ShopPriceOption): PackEdit[] => {
  const rng = createRng(`${option.seed}${SHOP_PRICE_STREAM}`);
  return readPriceSlots(pack).flatMap((slot) => slotEdits(slot, priceOf(option.mode, slot.price, rng.next())));
};

export { planShopPriceEdits };
