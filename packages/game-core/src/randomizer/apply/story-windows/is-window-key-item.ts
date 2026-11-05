/* @layer bridge-wasm @kind logic */
import { KEY_ITEM_OF_ROM_ID } from '../../world/spot-item-of-rom-id.constants';
import { JETS_ITEM_ID } from '../jets/jets-item.constants';

const isWindowKeyItem = (item: number): boolean => KEY_ITEM_OF_ROM_ID.has(item) || item === JETS_ITEM_ID;

export { isWindowKeyItem };
