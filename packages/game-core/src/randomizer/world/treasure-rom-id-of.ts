/* @layer bridge-wasm @kind logic */
import { TREASURE_ITEM_PREFIX } from './ct-key-items.constants';
import { JETS_ROM_ID } from './epoch-fail/epoch-fail-flight.constants';

const treasureRomIdOf = (item: string): number | null => {
  if (item === 'jets-of-time') return JETS_ROM_ID;
  if (!item.startsWith(TREASURE_ITEM_PREFIX)) return null;
  const id = Number.parseInt(item.slice(TREASURE_ITEM_PREFIX.length), 16);
  return Number.isNaN(id) ? null : id;
};

export { treasureRomIdOf };
