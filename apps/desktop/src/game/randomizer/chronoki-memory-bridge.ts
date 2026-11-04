/* @layer bridge-wasm @kind logic */
import { createCtMemoryBridge } from '@chronoki/game-core';
import { chronokiMemoryOptions } from './chronoki-memory-options';

const chronokiMemoryBridge = createCtMemoryBridge(chronokiMemoryOptions);

export { chronokiMemoryBridge };
