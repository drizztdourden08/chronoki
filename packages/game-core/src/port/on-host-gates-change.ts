/* @layer bridge-wasm @kind logic */
import { hostGateState } from './host-gate-state';

const onHostGatesChange = (listener: () => void): (() => void) => {
  hostGateState.listeners.add(listener);
  return () => hostGateState.listeners.delete(listener);
};

export { onHostGatesChange };
