/* @layer bridge-wasm @kind logic */
import type { CtItem } from './ct-world-keys.type';
import { isCtKeyItem } from './is-ct-key-item';

const treasureOnly = (item: CtItem): boolean => !isCtKeyItem(item);

export { treasureOnly };
