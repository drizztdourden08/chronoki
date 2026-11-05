/* @layer bridge-wasm @kind logic */
import type { RomView } from '../../randomizer/checks/create-pack-rom-view.type';
import { itemRecordOf } from '../../randomizer/world/treasure-tiers/item-record-of';
import { romWordAt } from '../../randomizer/world/treasure-tiers/rom-word-at';
import { RECORD_PRICE_AT } from '../../randomizer/world/treasure-tiers/treasure-tiers.constants';

const itemPriceOf = (rom: RomView, id: number): number | null => {
  const ref = itemRecordOf(rom, id);
  return ref === null ? null : romWordAt(rom, ref.record + RECORD_PRICE_AT);
};

export { itemPriceOf };
