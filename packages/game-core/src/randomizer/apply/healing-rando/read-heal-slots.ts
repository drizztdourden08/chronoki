/* @layer bridge-wasm @kind logic */
import type { NamedTable, RomSpace } from '../tech-order/tech-order.type';
import {
  HEAL_KIND_HP, HEAL_KIND_MP, HEAL_RECORD_BASE_AT, HEAL_RECORD_BYTES, HEAL_RECORD_MULT_AT, HEAL_RECORD_ROM,
} from './healing-rando.constants';
import type { HealSlot } from './healing-rando.type';

const readHealSlots = (pack: Uint8Array, space: RomSpace, kinds: NamedTable, amounts: NamedTable): HealSlot[] => {
  const slots: HealSlot[] = [];
  const count = Math.min(kinds.size, Math.floor(amounts.size / 2));
  for (let index = 0; index < count; index += 1) {
    const kind = pack[kinds.at + index] ?? 0;
    const amount = (pack[amounts.at + index * 2] ?? 0) | ((pack[amounts.at + index * 2 + 1] ?? 0) << 8);
    const record = HEAL_RECORD_ROM + index * HEAL_RECORD_BYTES;
    const mult = space.read(record + HEAL_RECORD_MULT_AT) ?? 0;
    const base = space.read(record + HEAL_RECORD_BASE_AT) ?? 0;
    const healing = kind === HEAL_KIND_HP || kind === HEAL_KIND_MP;
    if (healing && amount > 0 && mult > 0 && mult * base === amount) slots.push({ index, kind, mult, amount, record });
  }
  return slots;
};

export { readHealSlots };
