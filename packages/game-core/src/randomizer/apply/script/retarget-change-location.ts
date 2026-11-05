/* @layer bridge-wasm @kind logic */
import { encodeChangeLocation } from './encode-change-location';
import { OP_CHANGE_LOCATION_FADE } from './script-ops.constants';

const retargetChangeLocation = (anchor: Uint8Array, location: number, x: number, y: number): Uint8Array =>
  encodeChangeLocation(location, x, y, { op: anchor[0] ?? OP_CHANGE_LOCATION_FADE, flags: anchor[2] ?? 0 });

export { retargetChangeLocation };
