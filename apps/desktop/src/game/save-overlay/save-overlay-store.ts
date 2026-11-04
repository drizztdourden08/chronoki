/* @layer bridge-wasm @kind logic */
import { CLOSED_OVERLAY } from './save-overlay.constants';
import type { SaveOverlayState } from './save-overlay.type';

const listeners = new Set<() => void>();
const holder: { state: SaveOverlayState } = { state: CLOSED_OVERLAY };

const saveOverlayStore = {
  get: (): SaveOverlayState => holder.state,
  set: (patch: Partial<SaveOverlayState>): void => {
    holder.state = { ...holder.state, ...patch };
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export { saveOverlayStore };
