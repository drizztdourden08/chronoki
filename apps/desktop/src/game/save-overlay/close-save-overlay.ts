/* @layer bridge-wasm @kind logic */
import { clearIdleClose } from './clear-idle-close';
import { saveOverlayStore } from './save-overlay-store';

const closeSaveOverlay = (): void => {
  clearIdleClose();
  if (saveOverlayStore.get().open) saveOverlayStore.set({ open: false, holdProgress: 0 });
};

export { closeSaveOverlay };
