/* @layer bridge-wasm @kind logic */
import { frameCaptureState } from './frame-capture-state';

const clearPendingCapture = (): void => {
  if (frameCaptureState.timer) clearTimeout(frameCaptureState.timer);
  frameCaptureState.timer = null;
  frameCaptureState.pending = null;
};

export { clearPendingCapture };
