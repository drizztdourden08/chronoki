/* @layer renderer-appshell @kind logic */
import { saveOverlayStore } from '@app/stores/save-overlay-store';
import { cycleSlot } from './cycle-slot';
import { stateContext } from './state-context';

const stepSlot = (direction: 1 | -1): void => {
  const slot = cycleSlot(direction);
  if (stateContext()) saveOverlayStore.show(slot);
};

export { stepSlot };
