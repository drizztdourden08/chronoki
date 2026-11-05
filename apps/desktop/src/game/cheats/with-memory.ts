/* @layer bridge-wasm @kind logic */
import { chronokiMemoryOptions } from '../randomizer/chronoki-memory-options';

const withMemory = <T>(fallback: T, read: (heap: Uint8Array, ptr: number) => T): T => {
  const heap = chronokiMemoryOptions.heap();
  const ptr = chronokiMemoryOptions.wramPtr();
  if (!heap || !chronokiMemoryOptions.isLive() || ptr <= 0) return fallback;
  return read(heap, ptr);
};

export { withMemory };
