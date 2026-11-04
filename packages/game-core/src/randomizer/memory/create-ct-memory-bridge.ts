/* @layer bridge-wasm @kind logic */
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_BYTES } from './ct-memory.constants';
import type { CtMemoryOptions } from './ct-memory-options.type';
import { createCtMemoryView } from './create-ct-memory-view';

const createCtMemoryBridge = (options: CtMemoryOptions): MemoryBridge => ({
  view: () => {
    const heap = options.heap();
    const ptr = options.wramPtr();
    if (!heap || !options.isLive() || ptr <= 0 || heap.length < ptr + CT_WRAM_BYTES) return null;
    return createCtMemoryView(heap, ptr);
  },
  onStateLoaded: options.onLoaded,
});

export { createCtMemoryBridge };
