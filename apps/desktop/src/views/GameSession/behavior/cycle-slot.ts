/* @layer renderer-appshell @kind logic */
import { CT_QUICK_SLOTS } from '@chronoki/game-core';
import { selected } from './selected-slot';

const cycleSlot = (direction: 1 | -1): number => {
  selected.slot = (selected.slot + direction + CT_QUICK_SLOTS) % CT_QUICK_SLOTS;
  return selected.slot;
};

export { cycleSlot };
