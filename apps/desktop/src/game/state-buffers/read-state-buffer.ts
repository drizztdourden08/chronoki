/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { EXPORT_STATE_BUFFER, EXPORT_STATE_SIZE } from './state-buffers.constants';

const readStateBuffer = (calls: CoreCalls): Uint8Array | null => {
  const ptr = calls.number(EXPORT_STATE_BUFFER);
  const size = calls.number(EXPORT_STATE_SIZE);
  if (!ptr || size <= 0) return null;
  return calls.heap().slice(ptr, ptr + size);
};

export { readStateBuffer };
