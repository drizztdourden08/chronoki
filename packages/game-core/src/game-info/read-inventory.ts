/* @layer bridge-wasm @kind logic */
import { INVENTORY_COUNTS, INVENTORY_IDS, INVENTORY_SLOTS } from './wram-map.constants';
import { byteAt } from './read-bytes';
import type { GameInfoItem } from './game-info.type';

const readInventory = (heap: Uint8Array, ptr: number): GameInfoItem[] => {
  const items: GameInfoItem[] = [];
  for (let slot = 0; slot < INVENTORY_SLOTS; slot += 1) {
    const id = byteAt(heap, ptr + INVENTORY_IDS + slot);
    const count = byteAt(heap, ptr + INVENTORY_COUNTS + slot);
    if (id !== 0 && count !== 0) items.push({ slot, id, count });
  }
  return items;
};

export { readInventory };
