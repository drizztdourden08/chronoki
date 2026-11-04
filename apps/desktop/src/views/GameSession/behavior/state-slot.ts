/* @layer renderer-appshell @kind logic */
import { CT_QUICK_SLOTS } from '@chronoki/game-core';

const selected = { slot: 0 };

const currentSlot = (): number => selected.slot;

const cycleSlot = (direction: 1 | -1): number => {
  selected.slot = (selected.slot + direction + CT_QUICK_SLOTS) % CT_QUICK_SLOTS;
  return selected.slot;
};

export { currentSlot, cycleSlot };
