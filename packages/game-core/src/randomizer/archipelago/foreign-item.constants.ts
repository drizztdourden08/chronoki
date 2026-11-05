/* @layer bridge-wasm @kind constants */
import { treasureItemOf } from '../world/treasure-item-of';

const FOREIGN_ROM_ID = 0xfe;

const FOREIGN_ITEM_KEY = treasureItemOf(FOREIGN_ROM_ID);

export { FOREIGN_ITEM_KEY, FOREIGN_ROM_ID };
