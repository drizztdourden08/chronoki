/* @layer shared-asset-extraction @kind logic */
import { CTLS_HEADER, WRAM_AT, WRAM_BYTES } from './require-tools.constants';

const wramOfState = (state: Uint8Array): Uint8Array => {
  const isCtls = String.fromCharCode(...state.subarray(0, 4)) === 'CTLS';
  const payload = state.subarray(isCtls ? CTLS_HEADER : 0);
  return payload.subarray(WRAM_AT, WRAM_AT + WRAM_BYTES);
};

export { wramOfState };
