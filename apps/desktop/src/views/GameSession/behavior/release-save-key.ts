/* @layer renderer-appshell @kind logic */
import { HOLD_TO_SAVE_MS, TAP_TO_LOAD_MS, armIdleClose, closeSaveOverlay, endSaveHold } from '@app/game/save-overlay';
import { currentSlot } from './current-slot';
import { loadFromSlot } from './load-from-slot';
import { saveToSlot } from './save-to-slot';

const releaseSaveKey = async (): Promise<void> => {
  const elapsed = endSaveHold();
  if (elapsed === null) return;
  const slot = currentSlot();
  if (elapsed >= HOLD_TO_SAVE_MS) await saveToSlot(slot);
  else if (elapsed < TAP_TO_LOAD_MS) await loadFromSlot(slot);
  else {
    armIdleClose();
    return;
  }
  closeSaveOverlay();
};

export { releaseSaveKey };
