/* @layer bridge-wasm @kind logic */
import { clearIdleClose } from './clear-idle-close';
import { idleTimer } from './idle-close.state';
import { IDLE_CLOSE_MS } from './save-overlay.constants';
import { saveOverlayStore } from './save-overlay-store';

const armIdleClose = (): void => {
  clearIdleClose();
  if (saveOverlayStore.get().slot === null) return;
  idleTimer.id = setTimeout(() => saveOverlayStore.set({ open: false, holdProgress: 0 }), IDLE_CLOSE_MS);
};

export { armIdleClose };
