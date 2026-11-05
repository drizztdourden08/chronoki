/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import { itemRecordOf } from './item-record-of';
import { readGearPower } from './read-gear-power';
import { romWordAt } from './rom-word-at';
import type { ItemRecordRef, ItemStat } from './treasure-tier.type';
import { CLASS_KINDS, POWER_CLASSES, RECORD_MASK_AT, RECORD_PRICE_AT } from './treasure-tiers.constants';

const kindOf = (cls: number): string => CLASS_KINDS[cls] ?? 'gear';

const priceStat = (view: RomView, id: number, ref: ItemRecordRef): ItemStat | null => {
  const price = romWordAt(view, ref.record + RECORD_PRICE_AT);
  return price === null || price === 0 ? null : { id, kind: kindOf(ref.cls), score: price };
};

const gearStat = (view: RomView, id: number, ref: ItemRecordRef): ItemStat | null => {
  const power = readGearPower(view, ref);
  const mask = view(ref.record + RECORD_MASK_AT);
  if (power === null || power === 0 || mask === null) return null;
  return { id, kind: ref.cls === 0 ? `weapon:${mask}` : kindOf(ref.cls), score: power };
};

const readItemStat = (view: RomView, id: number): ItemStat | null => {
  const ref = itemRecordOf(view, id);
  if (ref === null) return null;
  return ref.cls >= POWER_CLASSES ? priceStat(view, id, ref) : gearStat(view, id, ref);
};

export { readItemStat };
