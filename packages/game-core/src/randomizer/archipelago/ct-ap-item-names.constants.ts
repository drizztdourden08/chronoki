/* @layer bridge-wasm @kind constants */
import { CT_KEY_ITEM_NAMES, TREASURE_ITEM_PREFIX } from '../world/ct-key-items.constants';
import { CT_AP_ITEM_IDS } from './ct-ap-item-ids.constants';

const nameOfItem = (key: string): string => {
  if (key.startsWith(TREASURE_ITEM_PREFIX)) return `Treasure ${key.slice(TREASURE_ITEM_PREFIX.length).toUpperCase()}`;
  const name = Object.entries(CT_KEY_ITEM_NAMES).find(([item]) => item === key)?.[1];
  if (name === undefined) throw new Error(`item has no name: ${key}`);
  return name;
};

const CT_AP_ITEM_NAMES: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(CT_AP_ITEM_IDS).map(([key, id]) => [id, nameOfItem(key)]),
);

export { CT_AP_ITEM_NAMES };
