/* @layer bridge-wasm @kind logic */
import { createCtWramWriter } from '@chronoki/game-core';
import { chronokiMemoryOptions } from '../randomizer/chronoki-memory-options';
import { chronokiRawMemoryBridge } from '../randomizer/chronoki-raw-memory-bridge';

const cheatWrite = createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge);

const withMemory = <T>(fallback: T, read: (heap: Uint8Array, ptr: number) => T): T => {
  const heap = chronokiMemoryOptions.heap();
  const ptr = chronokiMemoryOptions.wramPtr();
  if (!heap || !chronokiMemoryOptions.isLive() || ptr <= 0) return fallback;
  return read(heap, ptr);
};

export { cheatWrite, withMemory };
