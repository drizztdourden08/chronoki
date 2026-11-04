/* @layer shared-asset-extraction @kind logic */
import { WRAM_BYTES, WRAM_AT_IN_PAYLOAD, CTLS_WRAP_BYTES } from './check-expect.constants';

const wramOf = (state: Uint8Array): Uint8Array => {
  const wrapped = state[0] === 0x43 && state[1] === 0x54 && state[2] === 0x4c && state[3] === 0x53;
  const payload = wrapped ? state.subarray(CTLS_WRAP_BYTES) : state;
  return payload.subarray(WRAM_AT_IN_PAYLOAD, WRAM_AT_IN_PAYLOAD + WRAM_BYTES);
};

export { wramOf };
