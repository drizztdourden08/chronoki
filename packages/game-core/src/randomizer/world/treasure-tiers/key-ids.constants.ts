/* @layer bridge-wasm @kind constants */
import { CT_KEY_ITEM_ROM_IDS } from '../ct-key-item-rom-ids.constants';

const KEY_IDS: ReadonlySet<number> = new Set(Object.values(CT_KEY_ITEM_ROM_IDS));

export { KEY_IDS };
