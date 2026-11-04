/* @layer bridge-wasm @kind logic */
import { SRAM_SLOT_COUNT } from './save-file.constants';
import { isSramSlotValid } from './is-sram-slot-valid';

const validSramSlots = (bytes: Uint8Array): number[] =>
  Array.from({ length: SRAM_SLOT_COUNT }, (_, slot) => slot).filter((slot) => isSramSlotValid(bytes, slot));

export { validSramSlots };
