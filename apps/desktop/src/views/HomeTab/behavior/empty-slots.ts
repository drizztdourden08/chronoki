/* @layer renderer-components @kind logic */
import { QUICK_SAVE_SLOTS } from '../HomeTab.constants';
import type { SlotInfo } from '../HomeTab.type';

const emptySlots = (): SlotInfo[] => Array.from({ length: QUICK_SAVE_SLOTS }, (_, slot) => ({ slot, savedAt: null, screenshot: null }));

export { emptySlots };
