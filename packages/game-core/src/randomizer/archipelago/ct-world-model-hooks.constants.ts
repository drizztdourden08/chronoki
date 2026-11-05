/* @layer bridge-wasm @kind constants */
import type { CtItem } from '../world/ct-world-keys.type';

const CT_HELPER_ITEMS: Readonly<Record<string, readonly CtItem[]>> = {
  'sun-stone-charged': ['moon-stone'],
  'sealed-open': ['pendant'],
  'go-mode': [],
};

export { CT_HELPER_ITEMS };
