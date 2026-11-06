/* @layer bridge-wasm @kind logic */
import { NO_SLOT } from './chronoki-ap-current-slot.constants';

let current = NO_SLOT;

const chronokiApCurrentSlot = {
  get: (): number => current,
  set: (slot: number): void => {
    current = slot;
  },
};

export { chronokiApCurrentSlot };
