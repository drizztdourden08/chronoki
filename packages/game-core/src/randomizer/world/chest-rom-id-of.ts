/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_ROM_IDS } from './ct-key-item-rom-ids.constants';
import { treasureRomIdOf } from './treasure-rom-id-of';

const romIds: Readonly<Partial<Record<string, number>>> = CT_KEY_ITEM_ROM_IDS;

const chestRomIdOf = (item: string): number | null => treasureRomIdOf(item) ?? romIds[item] ?? null;

export { chestRomIdOf };
