/* @layer bridge-wasm @kind logic */
import { TREASURE_ITEM_PREFIX } from './ct-key-items.constants';
import type { CtItem, CtKeyItem } from './ct-world-keys.type';

const isCtKeyItem = (item: CtItem): item is CtKeyItem => !item.startsWith(TREASURE_ITEM_PREFIX);

export { isCtKeyItem };
