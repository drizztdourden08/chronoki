/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { readInventoryCounts, readJoinedCharacters } from '@chronoki/game-core';
import { KEY_ITEM_OF_ROM_ID, KEY_ITEM_ROM_ID_SET } from './tracker.constants';

const heldOfView = (view: MemoryView | null): readonly string[] => {
  if (view === null) return [];
  const counts = readInventoryCounts(view, KEY_ITEM_ROM_ID_SET);
  const items = [...counts].flatMap(([romId, count]) => {
    const item = KEY_ITEM_OF_ROM_ID.get(romId);
    return item !== undefined && count > 0 ? [item] : [];
  });
  return [...items, ...readJoinedCharacters(view)];
};

export { heldOfView };
