/* @layer bridge-wasm @kind logic */
import { createCtMemoryBridge } from '@chronoki/game-core';
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/memory';
import { chronokiMemoryOptions } from './chronoki-memory-options';

const chronokiRawMemoryBridge: MemoryBridge = createCtMemoryBridge(chronokiMemoryOptions);

export { chronokiRawMemoryBridge };
