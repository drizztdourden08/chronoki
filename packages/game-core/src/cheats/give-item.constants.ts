/* @layer bridge-wasm @kind constants */
import { INVENTORY_SLOTS } from '../game-info/wram-map.constants';

const SLOTS = Array.from({ length: INVENTORY_SLOTS }, (_, slot) => slot);

export { SLOTS };
