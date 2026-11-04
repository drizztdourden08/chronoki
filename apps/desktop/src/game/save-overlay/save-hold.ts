/* @layer bridge-wasm @kind logic */
import { clearIdleClose } from './idle-close';
import { HOLD_TO_SAVE_MS } from './save-overlay.constants';
import { saveOverlayStore } from './save-overlay-store';

const hold: { start: number | null; frame: number } = { start: null, frame: 0 };

const isHolding = (): boolean => hold.start !== null;

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

const endSaveHold = (): number | null => {
  if (hold.start === null) return null;
  const elapsed = performance.now() - hold.start;
  cancelAnimationFrame(hold.frame);
  hold.start = null;
  saveOverlayStore.set({ holdProgress: 0 });
  return elapsed;
};

export { endSaveHold, isHolding, startSaveHold };
