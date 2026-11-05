/* @layer bridge-wasm @kind logic */
import { createCtWramWriter } from '@chronoki/game-core';
import { chronokiMemoryOptions } from '../randomizer/chronoki-memory-options';
import { chronokiRawMemoryBridge } from '../randomizer/chronoki-raw-memory-bridge';

const cheatWrite = createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge);

export { cheatWrite };
