/* @layer bridge-wasm @kind logic */
import { readGameInfo } from '@chronoki/game-core';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { withMemory } from './cheat-memory';

const readCheatSnapshot = (): GameInfoSnapshot | null => withMemory(null, (heap, ptr) => readGameInfo(heap, ptr));

export { readCheatSnapshot };
