/* @layer bridge-wasm @kind logic */
import { captureFrame } from '@drizztdourden08/brock-port-kit/renderer';
import { clearPendingCapture } from './clear-pending-capture';
import { frameCaptureState } from './frame-capture-state';

const fulfillFrameCapture = (canvas: HTMLCanvasElement): void => {
  const resolve = frameCaptureState.pending;
  if (!resolve || !canvas.width || !canvas.height) return;
  clearPendingCapture();
  void captureFrame(canvas).then(resolve, () => resolve(null));
};

export { fulfillFrameCapture };
