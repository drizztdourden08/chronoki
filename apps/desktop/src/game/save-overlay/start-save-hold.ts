/* @layer bridge-wasm @kind logic */
import { clearIdleClose } from './clear-idle-close';
import { hold } from './save-hold.state';
import { HOLD_TO_SAVE_MS } from './save-overlay.constants';
import { saveOverlayStore } from './save-overlay-store';

const tick = (): void => {
  if (hold.start === null) return;
  const progress = Math.min((performance.now() - hold.start) / HOLD_TO_SAVE_MS, 1);
  saveOverlayStore.set({ holdProgress: progress });
  if (progress < 1) hold.frame = requestAnimationFrame(tick);
};

const startSaveHold = (): void => {
  clearIdleClose();
  hold.start = performance.now();
  hold.frame = requestAnimationFrame(tick);
};

export { startSaveHold };
