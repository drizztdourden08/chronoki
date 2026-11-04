/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import { closeSaveOverlay, openSaveOverlay, saveOverlayStore } from '@app/game/save-overlay';
import { SAVE_STATES_GATE } from '../GameSession.constants';
import { stateContext } from './state-context';

const toggleSaveOverlay = (): void => {
  if (saveOverlayStore.get().open) {
    closeSaveOverlay();
    return;
  }
  if (hostGate(SAVE_STATES_GATE) && stateContext()) openSaveOverlay(null);
};

export { toggleSaveOverlay };
