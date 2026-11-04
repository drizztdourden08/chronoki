/* @layer bridge-wasm @kind logic */
import { decodeCkState } from '@chronoki/game-core';
import { decodeSaveSlot } from '@drizztdourden08/brock-port-kit';

const decodeStoredState = (bytes: Uint8Array, portId: string): ReturnType<typeof decodeCkState> => {
  const slot = decodeSaveSlot(bytes, portId, { acceptRaw: false });
  return slot.ok ? decodeCkState(slot.record.state) : null;
};

export { decodeStoredState };
