/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_ROM_IDS } from '../world/ct-key-item-rom-ids.constants';
import { treasureRomIdOf } from '../world/treasure-rom-id-of';
import type { CtBaseKeyItem } from '../world/ct-world-keys.type';
import type { CtGiveAction } from './give-ct-item.type';

const ctGiveActionOf = (itemKey: string): CtGiveAction | null => {
  if (itemKey === 'jets-of-time') return { kind: 'give', item: { type: 'jets' } };
  const romId = CT_KEY_ITEM_ROM_IDS[itemKey as CtBaseKeyItem] ?? treasureRomIdOf(itemKey);
  return romId === null || romId === undefined ? null : { kind: 'give', item: { type: 'inventory', romId, count: 1 } };
};

export { ctGiveActionOf };
