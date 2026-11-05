/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_ROM_IDS } from '../ct-key-item-rom-ids.constants';
import { tierSlotOf } from './tier-slot-of';
import type { TierSlot } from './treasure-tier.type';

const KEY_IDS: ReadonlySet<number> = new Set(Object.values(CT_KEY_ITEM_ROM_IDS));

const isKeyId = (item: number): boolean => KEY_IDS.has(item);

const tierPoolOf = (slot: TierSlot): number[] => {
  const ids: number[] = [];
  for (let id = slot.group.first; id <= slot.group.last; id += 1) {
    if (!isKeyId(id) && tierSlotOf(id)?.tier === slot.tier) ids.push(id);
  }
  return ids;
};

export { isKeyId, tierPoolOf };
