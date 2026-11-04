/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { STAMP_MAX_BYTES } from './state-buffers.constants';

const readHeapText = (calls: CoreCalls, ptr: number): string => {
  const heap = calls.heap();
  let end = ptr;
  while (end < heap.length && end - ptr < STAMP_MAX_BYTES && heap[end] !== 0) end += 1;
  return new TextDecoder().decode(heap.subarray(ptr, end));
};

export { readHeapText };
