/* @layer bridge-wasm @kind logic */
import { armIdleClose } from './idle-close';
import { saveOverlayStore } from './save-overlay-store';

const openSaveOverlay = (slot: number): void => {
  saveOverlayStore.set({ open: true, slot, holdProgress: 0 });
  armIdleClose();
};

export { openSaveOverlay };
