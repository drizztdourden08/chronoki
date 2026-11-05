/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import { itemClassOf } from './item-class-of';
import { romWordAt } from './rom-word-at';
import type { ItemRecordRef } from './treasure-tier.type';
import { CLASS_BOUNDS_ROM, ITEM_PAGE_ROM, RECORD_BASE_ROM, RECORD_STRIDE_ROM } from './treasure-tiers.constants';

const itemRecordOf = (view: RomView, id: number): ItemRecordRef | null => {
  const cls = itemClassOf(view, id);
  const first = cls === null ? null : view(CLASS_BOUNDS_ROM + cls);
  if (cls === null || (cls !== 0 && first === null)) return null;
  const index = id - (cls === 0 ? 0 : (first ?? 0));
  const base = romWordAt(view, RECORD_BASE_ROM + cls * 2);
  const stride = view(RECORD_STRIDE_ROM + cls);
  if (base === null || stride === null) return null;
  return { cls, index, record: ITEM_PAGE_ROM + base + index * stride };
};

export { itemRecordOf };
