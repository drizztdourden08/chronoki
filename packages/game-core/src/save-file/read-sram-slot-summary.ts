/* @layer bridge-wasm @kind logic */
import {
  SLOT_CLOCK_HOURS, SLOT_CLOCK_MINUTE_ONES, SLOT_CLOCK_MINUTE_TENS, SLOT_EMPTY_LEAD_FLAG, SLOT_LEAD_MASK,
  SLOT_LOCATION, SLOT_LOCATION_MASK, SLOT_PARTY_LEAD, SLOT_SAVE_NUMBER, SLOT_SAVE_NUMBER_CAP, SLOT_SHEETS,
  SLOT_NAMES, SLOT_NAME_BYTES, SLOT_SHEET_LEVEL, SLOT_SHEET_STRIDE, SRAM_SLOT_BASES,
} from './save-file.constants';
import { decodeSaveName } from './decode-save-name';
import { isSramSlotValid } from './is-sram-slot-valid';
import { wordAt } from './word-at';
import type { SramSlotSummary } from './save-file.type';

const readSramSlotSummary = (bytes: Uint8Array, slot: number): SramSlotSummary | null => {
  if (!isSramSlotValid(bytes, slot)) return null;
  const base = SRAM_SLOT_BASES[slot] ?? 0;
  const lead = bytes[base + SLOT_PARTY_LEAD] ?? 0;
  if (lead & SLOT_EMPTY_LEAD_FLAG) return null;
  const leadId = lead & SLOT_LEAD_MASK;
  return {
    slot,
    leadId,
    leadName: decodeSaveName(bytes.subarray(base + SLOT_NAMES + leadId * SLOT_NAME_BYTES, base + SLOT_NAMES + (leadId + 1) * SLOT_NAME_BYTES)),
    level: bytes[base + SLOT_SHEETS + leadId * SLOT_SHEET_STRIDE + SLOT_SHEET_LEVEL] ?? 0,
    saveNumber: Math.min(wordAt(bytes, base + SLOT_SAVE_NUMBER), SLOT_SAVE_NUMBER_CAP),
    locationId: wordAt(bytes, base + SLOT_LOCATION) & SLOT_LOCATION_MASK,
    hours: bytes[base + SLOT_CLOCK_HOURS] ?? 0,
    minutes: (bytes[base + SLOT_CLOCK_MINUTE_TENS] ?? 0) * 10 + (bytes[base + SLOT_CLOCK_MINUTE_ONES] ?? 0),
  };
};

export { readSramSlotSummary };
