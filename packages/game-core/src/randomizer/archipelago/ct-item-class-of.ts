/* @layer bridge-wasm @kind logic */
import type { ItemClass } from '@drizztdourden08/brock-randomizer/archipelago';
import { CT_KEY_ITEM_NAMES, TREASURE_ITEM_PREFIX } from '../world/ct-key-items.constants';
import { CT_AP_ITEM_IDS } from './ct-ap-item-ids.constants';

const ctItemClassOf = (key: string): ItemClass => {
  if (!(key in CT_AP_ITEM_IDS)) throw new Error(`item has no Archipelago id: ${key}`);
  if (key.startsWith(TREASURE_ITEM_PREFIX)) return 'filler';
  if (!(key in CT_KEY_ITEM_NAMES)) throw new Error(`item has no class: ${key}`);
  return 'progression';
};

export { ctItemClassOf };
