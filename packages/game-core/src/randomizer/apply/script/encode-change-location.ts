/* @layer bridge-wasm @kind logic */
import type { ChangeLocationOptions } from './change-location-options.type';
import { LOCATION_MASK, OP_CHANGE_LOCATION_FADE } from './script-ops.constants';

const encodeChangeLocation = (
  location: number,
  x: number,
  y: number,
  { op = OP_CHANGE_LOCATION_FADE, flags = 0 }: ChangeLocationOptions = {},
): Uint8Array => {
  const where = location & LOCATION_MASK;
  return Uint8Array.of(op, where & 0xff, (flags & 0xfe) | (where >> 8), x & 0xff, y & 0xff);
};

export { encodeChangeLocation };
