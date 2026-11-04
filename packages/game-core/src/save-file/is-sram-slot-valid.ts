/* @layer bridge-wasm @kind logic */
import {
  SRAM_CHECKSUM_OFFSET, SRAM_MIN_BYTES, SRAM_SIGNATURE, SRAM_SIGNATURE_OFFSET, SRAM_SLOT_BASES, SRAM_SLOT_COUNT,
} from './save-file.constants';
import { slotChecksum } from './slot-checksum';
import { wordAt } from './word-at';

const isSramSlotValid = (bytes: Uint8Array, slot: number): boolean => {
  if (bytes.byteLength < SRAM_MIN_BYTES || slot < 0 || slot >= SRAM_SLOT_COUNT) return false;
  if (wordAt(bytes, SRAM_SIGNATURE_OFFSET + slot * 2) !== SRAM_SIGNATURE) return false;
  return slotChecksum(bytes, SRAM_SLOT_BASES[slot] ?? 0) === wordAt(bytes, SRAM_CHECKSUM_OFFSET + slot * 2);
};

export { isSramSlotValid };
