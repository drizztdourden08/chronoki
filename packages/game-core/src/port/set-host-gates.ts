/* @layer bridge-wasm @kind logic */
import { hostGateState } from './host-gate-state';

const setHostGates = (effective: Iterable<string>): void => {
  hostGateState.effective = new Set(effective);
  for (const listener of hostGateState.listeners) listener();
};

export { setHostGates };
