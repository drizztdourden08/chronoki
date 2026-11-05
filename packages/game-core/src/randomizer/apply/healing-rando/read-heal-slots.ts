/* @layer bridge-wasm @kind logic */
import type { NamedTable, RomSpace } from '../tech-order/tech-order.type';
import type { HealSlot } from './healing-rando.type';
import { readHealSlot } from './read-heal-slot';

const readHealSlots = (pack: Uint8Array, space: RomSpace, kinds: NamedTable, amounts: NamedTable): HealSlot[] => {
  const count = Math.min(kinds.size, Math.floor(amounts.size / 2));
  return Array.from({ length: count }, (_, index) => readHealSlot(pack, space, kinds, amounts, index)).filter(
    (slot): slot is HealSlot => slot !== null,
  );
};

export { readHealSlots };
