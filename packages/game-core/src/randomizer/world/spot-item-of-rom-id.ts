/* @layer bridge-wasm @kind logic */
import type { CtItem } from './ct-world-keys.type';
import { KEY_ITEM_OF_ROM_ID } from './spot-item-of-rom-id.constants';
import { treasureItemOf } from './treasure-item-of';

const spotItemOfRomId = (romId: number): CtItem => KEY_ITEM_OF_ROM_ID.get(romId) ?? treasureItemOf(romId);

export { spotItemOfRomId };
