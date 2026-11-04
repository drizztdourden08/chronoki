/* @layer bridge-wasm @kind logic */
const listeners = new Set<() => void>();
const holder: { active: boolean } = { active: false };

const replanStore = {
  get: (): boolean => holder.active,
  set: (active: boolean): void => {
    holder.active = active;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export { replanStore };
