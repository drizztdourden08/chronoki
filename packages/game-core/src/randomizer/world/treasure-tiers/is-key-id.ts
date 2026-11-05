/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_ROM_IDS } from '../ct-key-item-rom-ids.constants';

const KEY_IDS: ReadonlySet<number> = new Set(Object.values(CT_KEY_ITEM_ROM_IDS));

const isKeyId = (item: number): boolean => KEY_IDS.has(item);

export { isKeyId };
