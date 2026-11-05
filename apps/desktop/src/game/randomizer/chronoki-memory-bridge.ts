/* @layer bridge-wasm @kind logic */
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/memory';
import { chronokiRawMemoryBridge } from './chronoki-raw-memory-bridge';
import { gameStartGate } from './game-start-gate';

const chronokiMemoryBridge: MemoryBridge = {
  ...chronokiRawMemoryBridge,
  view: () => (gameStartGate.started() ? chronokiRawMemoryBridge.view() : null),
};

export { chronokiMemoryBridge };
