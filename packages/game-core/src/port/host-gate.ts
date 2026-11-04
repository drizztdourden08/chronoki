/* @layer bridge-wasm @kind logic */
import { hostGateState } from './host-gate-state';

const hostGate = (id: string): boolean => hostGateState.effective.has(id);

export { hostGate };
