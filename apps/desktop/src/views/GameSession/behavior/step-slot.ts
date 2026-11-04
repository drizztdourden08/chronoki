/* @layer renderer-appshell @kind logic */
import { openSaveOverlay } from '@app/game/save-overlay';
import { cycleSlot } from './cycle-slot';
import { stateContext } from './state-context';

const stepSlot = (direction: 1 | -1): void => {
  const slot = cycleSlot(direction);
  if (stateContext()) openSaveOverlay(slot);
};

export { stepSlot };
