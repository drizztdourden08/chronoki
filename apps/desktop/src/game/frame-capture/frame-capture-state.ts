/* @layer bridge-wasm @kind logic */
import type { FrameCaptureState } from './frame-capture.type';

const frameCaptureState: FrameCaptureState = { pending: null, timer: null, effectLive: false };

export { frameCaptureState };
