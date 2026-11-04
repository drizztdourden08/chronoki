/* @layer renderer-lib @kind logic */
const listeners = new Set<() => void>();
const holder: { capturing: boolean } = { capturing: false };

const debugCaptureStore = {
  get: (): boolean => holder.capturing,
  set: (capturing: boolean): void => {
    holder.capturing = capturing;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export { debugCaptureStore };
