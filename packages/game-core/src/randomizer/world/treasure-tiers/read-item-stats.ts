/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import { readItemStat } from './read-item-stat';
import type { ItemStat } from './treasure-tier.type';
import { LAST_ITEM_ID } from './treasure-tiers.constants';

const readItemStats = (view: RomView): ItemStat[] => {
  const stats: ItemStat[] = [];
  for (let id = 1; id <= LAST_ITEM_ID; id += 1) {
    const stat = readItemStat(view, id);
    if (stat) stats.push(stat);
  }
  return stats;
};

export { readItemStats };
