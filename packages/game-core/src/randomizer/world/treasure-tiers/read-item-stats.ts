/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import {
  CLASS_BOUNDS_ROM, CLASS_KINDS, ITEM_PAGE_ROM, LAST_CLASS, LAST_ITEM_ID, POWER_BASE_ROM, POWER_CLASSES, POWER_STRIDE_ROM,
  RECORD_BASE_ROM, RECORD_MASK_AT, RECORD_PRICE_AT, RECORD_STRIDE_ROM,
} from './treasure-tiers.constants';
import type { ItemStat } from './treasure-tier.type';

const wordAt = (view: RomView, rom: number): number | null => {
  const lo = view(rom);
  const hi = view(rom + 1);
  return lo === null || hi === null ? null : lo | (hi << 8);
};

const classOf = (view: RomView, id: number): number | null => {
  for (let k = 0; k < LAST_CLASS; k += 1) {
    const bound = view(CLASS_BOUNDS_ROM + k + 1);
    if (bound === null) return null;
    if (id < bound) return k;
  }
  return LAST_CLASS;
};

const firstOf = (view: RomView, cls: number): number | null => (cls === 0 ? 0 : view(CLASS_BOUNDS_ROM + cls));

const readItemStat = (view: RomView, id: number): ItemStat | null => {
  const cls = classOf(view, id);
  const first = cls === null ? null : firstOf(view, cls);
  if (cls === null || first === null) return null;
  const at = id - first;
  const base = wordAt(view, RECORD_BASE_ROM + cls * 2);
  const stride = view(RECORD_STRIDE_ROM + cls);
  if (base === null || stride === null) return null;
  const record = ITEM_PAGE_ROM + base + at * stride;
  if (cls >= POWER_CLASSES) {
    const price = wordAt(view, record + RECORD_PRICE_AT);
    return price === null || price === 0 ? null : { id, kind: CLASS_KINDS[cls] ?? 'gear', score: price };
  }
  const powerBase = wordAt(view, POWER_BASE_ROM + cls * 2);
  const powerStride = view(POWER_STRIDE_ROM + cls);
  const power = powerBase === null || powerStride === null ? null : view(ITEM_PAGE_ROM + powerBase + at * powerStride);
  const mask = view(record + RECORD_MASK_AT);
  if (power === null || power === 0 || mask === null) return null;
  return { id, kind: cls === 0 ? `weapon:${mask}` : (CLASS_KINDS[cls] ?? 'gear'), score: power };
};

const readItemStats = (view: RomView): ItemStat[] => {
  const stats: ItemStat[] = [];
  for (let id = 1; id <= LAST_ITEM_ID; id += 1) {
    const stat = readItemStat(view, id);
    if (stat) stats.push(stat);
  }
  return stats;
};

export { readItemStats };
