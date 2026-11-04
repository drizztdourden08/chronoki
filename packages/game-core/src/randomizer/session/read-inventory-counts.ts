/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import { INVENTORY_COUNTS, INVENTORY_IDS, INVENTORY_SLOTS } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';

const readInventoryCounts = (view: MemoryView, wanted: ReadonlySet<number>): Map<number, number> => {
  const counts = new Map<number, number>();
  for (let slot = 0; slot < INVENTORY_SLOTS; slot += 1) {
    const id = view.byte(CT_WRAM_REGION, INVENTORY_IDS + slot);
    if (!wanted.has(id)) continue;
    counts.set(id, (counts.get(id) ?? 0) + view.byte(CT_WRAM_REGION, INVENTORY_COUNTS + slot));
  }
  return counts;
};

export { readInventoryCounts };
