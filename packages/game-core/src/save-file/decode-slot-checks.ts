/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../randomizer/checks/check.type';
import { isSramSlotValid } from './is-sram-slot-valid';
import { slotFlagState } from './slot-flag-state';
import type { SlotChecks } from './save-file.type';

const decodeSlotChecks = (bytes: Uint8Array, slot: number, checks: readonly CheckDef[]): SlotChecks | null => {
  if (!isSramSlotValid(bytes, slot)) return null;
  const result: SlotChecks = { done: [], unknown: [] };
  for (const check of checks) {
    const state = check.probe ? slotFlagState(bytes, slot, check.probe) : null;
    if (state === null) result.unknown.push(check.id);
    else if (state) result.done.push(check.id);
  }
  return result;
};

export { decodeSlotChecks };
