/* @layer bridge-wasm @kind logic */
import type { NamedTable, RomSpace } from '../tech-order/tech-order.type';
import {
  HEAL_KIND_HP, HEAL_KIND_MP, HEAL_RECORD_BASE_AT, HEAL_RECORD_BYTES, HEAL_RECORD_MULT_AT, HEAL_RECORD_ROM,
} from './healing-rando.constants';
import type { HealSlot } from './healing-rando.type';
import { readPackU16 } from './read-pack-u16';

const readHealSlot = (pack: Uint8Array, space: RomSpace, kinds: NamedTable, amounts: NamedTable, index: number): HealSlot | null => {
  const kind = pack[kinds.at + index] ?? 0;
  const amount = readPackU16(pack, amounts.at + index * 2);
  const record = HEAL_RECORD_ROM + index * HEAL_RECORD_BYTES;
  const mult = space.read(record + HEAL_RECORD_MULT_AT) ?? 0;
  const base = space.read(record + HEAL_RECORD_BASE_AT) ?? 0;
  const healing = kind === HEAL_KIND_HP || kind === HEAL_KIND_MP;
  return healing && amount > 0 && mult > 0 && mult * base === amount ? { index, kind, mult, amount, record } : null;
};

export { readHealSlot };
