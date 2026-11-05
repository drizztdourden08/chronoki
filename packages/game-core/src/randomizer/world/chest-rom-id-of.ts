/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_ROM_IDS } from './ct-key-item-rom-ids.constants';
import type { CtBaseKeyItem } from './ct-world-keys.type';
import { treasureRomIdOf } from './treasure-rom-id-of';

const chestRomIdOf = (item: string): number | null =>
  treasureRomIdOf(item) ?? CT_KEY_ITEM_ROM_IDS[item as CtBaseKeyItem] ?? null;

export { chestRomIdOf };
