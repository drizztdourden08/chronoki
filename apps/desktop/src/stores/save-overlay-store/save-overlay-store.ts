/* @layer renderer-appshell @kind logic */
import type { SaveOverlayShown } from './save-overlay-store.type';

const HIDDEN: SaveOverlayShown = { shown: false, slot: null };

const listeners = new Set<() => void>();
const holder: { state: SaveOverlayShown } = { state: HIDDEN };

const saveOverlayStore = {
  get: (): SaveOverlayShown => holder.state,
  show: (slot: number | null): void => {
    holder.state = { shown: true, slot };
    listeners.forEach((listener) => listener());
  },
  hide: (): void => {
    if (!holder.state.shown) return;
    holder.state = HIDDEN;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export { saveOverlayStore };
