/* @layer bridge-wasm @kind constants */
import type { SaveOverlayState } from './save-overlay.type';

const HOLD_TO_SAVE_MS = 1000;

const TAP_TO_LOAD_MS = 180;

const IDLE_CLOSE_MS = 4000;

const CLOSED_OVERLAY: SaveOverlayState = { open: false, slot: 0, holdProgress: 0 };

export { CLOSED_OVERLAY, HOLD_TO_SAVE_MS, IDLE_CLOSE_MS, TAP_TO_LOAD_MS };
