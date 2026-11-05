/* @layer bridge-wasm @kind logic */
import { createPackRomView } from '../../checks/create-pack-rom-view';
import { KEY_IDS } from '../../world/treasure-tiers/key-ids.constants';
import { itemRecordOf } from '../../world/treasure-tiers/item-record-of';
import { LAST_ITEM_ID, RECORD_PRICE_AT } from '../../world/treasure-tiers/treasure-tiers.constants';
import { packRomSpans } from '../enemy-table/pack-rom-spans';
import { PRICE_BYTES, PRICED_CLASSES } from './shop-prices.constants';
import type { PriceSlot } from './shop-prices.type';

const readPriceSlots = (pack: Uint8Array): PriceSlot[] => {
  const view = createPackRomView(pack);
  if (view === null) return [];
  const slots: PriceSlot[] = [];
  for (let id = 1; id <= LAST_ITEM_ID; id += 1) {
    const ref = KEY_IDS.has(id) ? null : itemRecordOf(view, id);
    if (ref !== null && PRICED_CLASSES.has(ref.cls)) {
      const rom = ref.record + RECORD_PRICE_AT;
      const price = (view(rom) ?? 0) | ((view(rom + 1) ?? 0) << 8);
      const at = packRomSpans(pack, rom, PRICE_BYTES);
      if (price > 0 && at.length > 0) slots.push({ id, price, at });
    }
  }
  return slots;
};

export { readPriceSlots };
