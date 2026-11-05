/* @layer bridge-wasm @kind logic */
import { LOCATION_MASK } from './script-ops.constants';

const changeLocationTarget = (op: Uint8Array): number => ((op[1] ?? 0) | ((op[2] ?? 0) << 8)) & LOCATION_MASK;

export { changeLocationTarget };
