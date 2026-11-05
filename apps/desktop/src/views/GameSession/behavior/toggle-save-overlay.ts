/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import { saveOverlayStore } from '@app/stores/save-overlay-store';
import { SAVE_STATES_GATE } from '../GameSession.constants';
import { stateContext } from './state-context';

const toggleSaveOverlay = (): void => {
  if (saveOverlayStore.get().shown) {
    saveOverlayStore.hide();
    return;
  }
  if (hostGate(SAVE_STATES_GATE) && stateContext()) saveOverlayStore.show(null);
};

export { toggleSaveOverlay };
