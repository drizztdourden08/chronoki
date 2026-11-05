/* @layer bridge-wasm @kind logic */
import { CHANGE_LOCATION_BYTES, CHANGE_LOCATION_OPS } from './script-ops.constants';

const isChangeLocation = (op: Uint8Array): boolean =>
  op.length === CHANGE_LOCATION_BYTES && CHANGE_LOCATION_OPS.includes(op[0] ?? -1);

export { isChangeLocation };
