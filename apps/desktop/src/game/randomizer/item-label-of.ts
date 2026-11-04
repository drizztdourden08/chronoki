/* @layer bridge-wasm @kind logic */
import type { CtKeyItem } from '@chronoki/game-core';
import { CT_KEY_ITEM_NAMES, treasureRomIdOf } from '@chronoki/game-core';

const itemLabelOf = (item: string): string => {
  const romId = treasureRomIdOf(item);
  if (romId !== null) return `item 0x${romId.toString(16).toUpperCase().padStart(2, '0')}`;
  return CT_KEY_ITEM_NAMES[item as CtKeyItem] ?? item;
};

export { itemLabelOf };
