/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { EXPORT_STATE_INPUT } from './state-buffers.constants';

const writeStateInput = (calls: CoreCalls, bytes: Uint8Array): number | null => {
  const ptr = calls.number(EXPORT_STATE_INPUT, bytes.length);
  if (!ptr) return null;
  calls.heap().set(bytes, ptr);
  return ptr;
};

export { writeStateInput };
