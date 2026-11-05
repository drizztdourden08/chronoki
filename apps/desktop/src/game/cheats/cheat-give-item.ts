/* @layer bridge-wasm @kind logic */
import { giveItem } from '@chronoki/game-core';
import { cheatWrite, withMemory } from './cheat-memory';

const cheatGiveItem = (id: number, count: number): boolean =>
  withMemory(false, (heap, ptr) => giveItem({ heap, ptr, write: cheatWrite, id, count }));

export { cheatGiveItem };
