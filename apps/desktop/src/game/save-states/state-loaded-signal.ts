/* @layer bridge-wasm @kind logic */
const listeners = new Set<() => void>();

const stateLoadedSignal = {
  on: (cb: () => void): (() => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  emit: (): void => {
    listeners.forEach((cb) => cb());
  },
};

export { stateLoadedSignal };
