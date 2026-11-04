/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import { isHolding, openSaveOverlay, startSaveHold } from '@app/game/save-overlay';
import { currentSlot } from './current-slot';
import { ENHANCED_SAVE_GATE } from '../GameSession.constants';
import { saveToSlot } from './save-to-slot';
import { stateContext } from './state-context';

const pressSaveKey = (): void => {
  if (!stateContext() || isHolding()) return;
  if (!hostGate(ENHANCED_SAVE_GATE)) {
    void saveToSlot(currentSlot());
    return;
  }
  openSaveOverlay(currentSlot());
  startSaveHold();
};

export { pressSaveKey };
