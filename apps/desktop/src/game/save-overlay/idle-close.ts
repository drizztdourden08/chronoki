/* @layer bridge-wasm @kind logic */
import { IDLE_CLOSE_MS } from './save-overlay.constants';
import { saveOverlayStore } from './save-overlay-store';

const timer: { id: ReturnType<typeof setTimeout> | undefined } = { id: undefined };

const clearIdleClose = (): void => {
  clearTimeout(timer.id);
  timer.id = undefined;
};

const armIdleClose = (): void => {
  clearIdleClose();
  timer.id = setTimeout(() => saveOverlayStore.set({ open: false, holdProgress: 0 }), IDLE_CLOSE_MS);
};

export { armIdleClose, clearIdleClose };
