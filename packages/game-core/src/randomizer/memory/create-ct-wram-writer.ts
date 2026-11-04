/* @layer bridge-wasm @kind logic */
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/session';
import { isCtSafeFrame } from '../safe-frame/is-ct-safe-frame';
import { CT_WRAM_BYTES } from './ct-memory.constants';
import type { CtMemoryOptions } from './ct-memory-options.type';

const createCtWramWriter = (options: CtMemoryOptions, bridge: MemoryBridge) =>
  (offset: number, bytes: Uint8Array): boolean => {
    const heap = options.heap();
    if (!heap || !isCtSafeFrame(bridge.view())) return false;
    if (offset < 0 || offset + bytes.length > CT_WRAM_BYTES) return false;
    heap.set(bytes, options.wramPtr() + offset);
    return true;
  };

export { createCtWramWriter };
