/* @layer bridge-wasm @kind logic */
import { createCtMemoryBridge } from '@chronoki/game-core';
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/memory';
import { chronokiMemoryOptions } from './chronoki-memory-options';
import { gameStartGate } from './game-start-gate';

const chronokiRawMemoryBridge: MemoryBridge = createCtMemoryBridge(chronokiMemoryOptions);

/** What the poller and the item writer see: no view until the player has really started, so the title attract demo is invisible to them. */
const chronokiMemoryBridge: MemoryBridge = {
  ...chronokiRawMemoryBridge,
  view: () => (gameStartGate.started() ? chronokiRawMemoryBridge.view() : null),
};

export { chronokiMemoryBridge, chronokiRawMemoryBridge };
