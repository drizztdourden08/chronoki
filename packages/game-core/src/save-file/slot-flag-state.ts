/* @layer bridge-wasm @kind logic */
import type { FlagProbe } from '../randomizer/checks/check.type';
import { FLAGS_WRAM_BASE, SLOT_FLAGS, SLOT_FLAGS_BYTES, SRAM_SLOT_BASES } from './save-file.constants';

const slotFlagState = (bytes: Uint8Array, slot: number, probe: FlagProbe): boolean | null => {
  const at = probe.offset - FLAGS_WRAM_BASE;
  if (at < 0 || at >= SLOT_FLAGS_BYTES) return null;
  const set = ((bytes[(SRAM_SLOT_BASES[slot] ?? 0) + SLOT_FLAGS + at] ?? 0) & probe.mask) !== 0;
  return probe.compare === 'set' ? set : !set;
};

export { slotFlagState };
