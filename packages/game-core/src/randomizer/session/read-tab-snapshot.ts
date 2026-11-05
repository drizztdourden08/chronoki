/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { SHEET_BASE, SHEET_COUNT, SHEET_STRIDE } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { readInventoryCounts } from './read-inventory-counts';
import { TAB_ITEM_IDS, TAB_STAT_SLOTS } from './tab-amount-watch.constants';
import type { TabSnapshot } from './tab-stat-slot.type';

const readTabSnapshot = (view: MemoryView): TabSnapshot => ({
  counts: readInventoryCounts(view, TAB_ITEM_IDS),
  stats: TAB_STAT_SLOTS.map((slot) =>
    Array.from({ length: SHEET_COUNT }, (_, sheet) =>
      view.byte(CT_WRAM_REGION, SHEET_BASE + sheet * SHEET_STRIDE + slot.base))),
});

export { readTabSnapshot };
