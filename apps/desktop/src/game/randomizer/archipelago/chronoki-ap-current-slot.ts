/* @layer bridge-wasm @kind logic */
const NO_SLOT = -1;

let current = NO_SLOT;

const chronokiApCurrentSlot = {
  get: (): number => current,
  set: (slot: number): void => {
    current = slot;
  },
};

export { chronokiApCurrentSlot, NO_SLOT };
