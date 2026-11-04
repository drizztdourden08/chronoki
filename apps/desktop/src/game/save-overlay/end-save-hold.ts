/* @layer bridge-wasm @kind logic */
import { hold } from './save-hold.state';
import { saveOverlayStore } from './save-overlay-store';

const endSaveHold = (): number | null => {
  if (hold.start === null) return null;
  const elapsed = performance.now() - hold.start;
  cancelAnimationFrame(hold.frame);
  hold.start = null;
  saveOverlayStore.set({ holdProgress: 0 });
  return elapsed;
};

export { endSaveHold };
