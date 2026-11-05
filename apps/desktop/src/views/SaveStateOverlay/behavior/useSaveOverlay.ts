/* @layer renderer-components @kind hook */
import { useCallback, useSyncExternalStore } from 'react';
import { saveOverlayStore } from '@app/stores/save-overlay-store';
import { useGameSession } from '@app/views/GameSession';
import { ENHANCED_SAVE_GATE, SAVE_STATES_GATE } from '@app/views/GameSession/GameSession.constants';
import { useEnhancedSaveSlot } from './useEnhancedSaveSlot';

const useSaveOverlay = () => {
  const { running, gates, saveHoldDuration } = useGameSession();
  const { shown, slot } = useSyncExternalStore(saveOverlayStore.subscribe, saveOverlayStore.get);
  const enhanced = useEnhancedSaveSlot(gates.has(ENHANCED_SAVE_GATE), saveHoldDuration, running && gates.has(SAVE_STATES_GATE));

  const open = (shown && running) || enhanced.open;

  const close = useCallback(() => {
    saveOverlayStore.hide();
    enhanced.close();
  }, [enhanced]);

  return {
    open,
    close,
    highlightedSlot: enhanced.highlightedSlot ?? (shown ? slot : null),
    holdProgress: enhanced.holdProgress,
    hints: enhanced.hints,
  };
};

export { useSaveOverlay };
