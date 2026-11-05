/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import { romWordAt } from './rom-word-at';
import type { ItemRecordRef } from './treasure-tier.type';
import { ITEM_PAGE_ROM, POWER_BASE_ROM, POWER_STRIDE_ROM } from './treasure-tiers.constants';

const readGearPower = (view: RomView, ref: ItemRecordRef): number | null => {
  const powerBase = romWordAt(view, POWER_BASE_ROM + ref.cls * 2);
  const powerStride = view(POWER_STRIDE_ROM + ref.cls);
  if (powerBase === null || powerStride === null) return null;
  return view(ITEM_PAGE_ROM + powerBase + ref.index * powerStride);
};

export { readGearPower };
