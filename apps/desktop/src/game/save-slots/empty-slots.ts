/* @layer bridge-wasm @kind logic */
import { QUICK_SAVE_SLOTS } from './save-slots.constants';
import type { SlotInfo } from './save-slots.type';

const emptySlots = (): SlotInfo[] => Array.from({ length: QUICK_SAVE_SLOTS }, (_, slot) => ({ slot, savedAt: null, screenshot: null }));

export { emptySlots };
