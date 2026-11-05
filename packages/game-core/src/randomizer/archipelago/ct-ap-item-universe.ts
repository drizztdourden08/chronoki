/* @layer bridge-wasm @kind logic */
import { compareApKeys } from './ap-key-order';
import { CT_AP_ITEM_IDS } from './ct-ap-item-ids.constants';

const ctApItemUniverse = (): readonly string[] => Object.keys(CT_AP_ITEM_IDS).sort(compareApKeys);

export { ctApItemUniverse };
