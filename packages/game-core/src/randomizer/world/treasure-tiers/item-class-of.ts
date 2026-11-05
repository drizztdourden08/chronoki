/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../checks/create-pack-rom-view.type';
import { CLASS_BOUNDS_ROM, LAST_CLASS } from './treasure-tiers.constants';

const itemClassOf = (view: RomView, id: number): number | null => {
  for (let k = 0; k < LAST_CLASS; k += 1) {
    const bound = view(CLASS_BOUNDS_ROM + k + 1);
    if (bound === null) return null;
    if (id < bound) return k;
  }
  return LAST_CLASS;
};

export { itemClassOf };
