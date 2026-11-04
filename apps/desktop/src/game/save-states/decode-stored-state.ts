/* @layer bridge-wasm @kind logic */
import { decodeSaveSlot } from '@drizztdourden08/brock-port-kit';

const decodeStoredState = (bytes: Uint8Array, portId: string): Uint8Array | null => {
  const slot = decodeSaveSlot(bytes, portId, { acceptRaw: false });
  return slot.ok ? slot.record.state : null;
};

export { decodeStoredState };
