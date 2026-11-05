/* @layer bridge-wasm @kind logic */
import { captureFrame } from '@drizztdourden08/brock-port-kit/renderer';
import { CAPTURE_TIMEOUT_MS } from './frame-capture.constants';
import { clearPendingCapture } from './clear-pending-capture';
import { frameCaptureState } from './frame-capture-state';

const captureGameFrame = (gameCanvas: HTMLCanvasElement): Promise<Blob | null> => {
  if (!frameCaptureState.effectLive) return captureFrame(gameCanvas);
  return new Promise((resolve) => {
    const superseded = frameCaptureState.pending;
    clearPendingCapture();
    superseded?.(null);
    frameCaptureState.pending = resolve;
    frameCaptureState.timer = setTimeout(() => {
      if (frameCaptureState.pending !== resolve) return;
      clearPendingCapture();
      void captureFrame(gameCanvas).then(resolve, () => resolve(null));
    }, CAPTURE_TIMEOUT_MS);
  });
};

export { captureGameFrame };
