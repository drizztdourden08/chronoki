/* @layer bridge-wasm @kind logic */
import { UNBOUND_KEY_ITEM_SPOTS } from '../checks/key-item-spot-gifts.constants';
import type { CtSpotId } from './ct-world-keys.type';
import { SPOT_VANILLA_ITEMS } from './spot-vanilla-items.constants';

const isPinnedPlacement = (location: string, item: string): boolean =>
  location in UNBOUND_KEY_ITEM_SPOTS && SPOT_VANILLA_ITEMS[location as CtSpotId] === item;

export { isPinnedPlacement };
