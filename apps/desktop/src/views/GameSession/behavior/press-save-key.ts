/* @layer renderer-appshell @kind logic */
import { isHolding, openSaveOverlay, startSaveHold } from '@app/game/save-overlay';
import { currentSlot } from './current-slot';
import { stateContext } from './state-context';

const pressSaveKey = (): void => {
  if (!stateContext() || isHolding()) return;
  openSaveOverlay(currentSlot());
  startSaveHold();
};

export { pressSaveKey };
