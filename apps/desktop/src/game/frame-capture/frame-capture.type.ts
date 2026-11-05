/* @layer bridge-wasm @kind types */
type CaptureResolve = (blob: Blob | null) => void;

interface FrameCaptureState {
  pending: CaptureResolve | null;
  timer: ReturnType<typeof setTimeout> | null;
  effectLive: boolean;
}

export type { CaptureResolve, FrameCaptureState };
