/* @layer bridge-wasm @kind logic */
import { refillCharacter } from '@chronoki/game-core';
import { cheatWrite, withMemory } from './cheat-memory';

const cheatRefill = (ids: readonly number[]): boolean =>
  withMemory(false, (heap, ptr) => ids.every((id) => refillCharacter(heap, ptr, cheatWrite, id)));

export { cheatRefill };
