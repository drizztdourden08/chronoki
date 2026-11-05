/* @layer bridge-wasm @kind logic */
import { CHEST_PAYLOAD_AT } from '../../apply/apply.constants';
import { TREASURE_BANK_ROM, TREASURE_POINTERS_ROM, TREASURE_RECORD_BYTES } from '../../checks/checks.constants';
import type { RomView } from '../../checks/create-pack-rom-view.type';

const chestPayloadAddress = (rom: RomView, id: string): number => {
  const [, locHex, nText] = id.split('-');
  const loc = Number.parseInt(locHex ?? '', 16);
  const n = Number.parseInt(nText ?? '', 10);
  const at = TREASURE_POINTERS_ROM + loc * 2;
  const lo = rom(at);
  const hi = rom(at + 1);
  if (Number.isNaN(loc) || Number.isNaN(n) || lo === null || hi === null) return -1;
  return TREASURE_BANK_ROM + (lo | (hi << 8)) + n * TREASURE_RECORD_BYTES + CHEST_PAYLOAD_AT;
};

export { chestPayloadAddress };
