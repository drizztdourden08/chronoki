/* @layer bridge-wasm @kind constants */
import { CT_KEY_ITEM_ROM_IDS } from './ct-key-item-rom-ids.constants';
import type { CtBaseKeyItem } from './ct-world-keys.type';

const KEY_ITEM_OF_ROM_ID: ReadonlyMap<number, CtBaseKeyItem> = new Map(
  Object.entries(CT_KEY_ITEM_ROM_IDS).map(([item, romId]): [number, CtBaseKeyItem] => [romId, item as CtBaseKeyItem]),
);

export { KEY_ITEM_OF_ROM_ID };
