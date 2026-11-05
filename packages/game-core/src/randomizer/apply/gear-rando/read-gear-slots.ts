/* @layer bridge-wasm @kind logic */
import { createPackRomView } from '../../checks/create-pack-rom-view';
import { itemRecordOf } from '../../world/treasure-tiers/item-record-of';
import { RECORD_MASK_AT } from '../../world/treasure-tiers/treasure-tiers.constants';
import type { RomSpace } from '../tech-order/tech-order.type';
import { GEAR_CLASSES, GEAR_LAST_ID, GEAR_STAT_ROM, GEAR_STAT_STRIDE } from './gear-rando.constants';
import type { GearSlot } from './gear-rando.type';

const readGearSlots = (pack: Uint8Array, space: RomSpace): GearSlot[] => {
  const view = createPackRomView(pack);
  if (view === null) return [];
  const slots: GearSlot[] = [];
  for (let id = 1; id <= GEAR_LAST_ID; id += 1) {
    const ref = itemRecordOf(view, id);
    if (ref !== null && ref.cls < GEAR_CLASSES) {
      const addr = (GEAR_STAT_ROM[ref.cls] ?? 0) + ref.index * (GEAR_STAT_STRIDE[ref.cls] ?? 0);
      const value = space.read(addr) ?? 0;
      const mask = view(ref.record + RECORD_MASK_AT);
      if (value > 0 && mask !== null) slots.push({ id, group: `${ref.cls}:${mask}`, addr, value });
    }
  }
  return slots;
};

export { readGearSlots };
