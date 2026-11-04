/* @layer bridge-wasm @kind types */
interface SaveOverlayState {
  open: boolean;
  slot: number | null;
  holdProgress: number;
}

export type { SaveOverlayState };
