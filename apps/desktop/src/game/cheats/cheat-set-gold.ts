/* @layer bridge-wasm @kind logic */
import { setGold } from '@chronoki/game-core';
import { cheatWrite, withMemory } from './cheat-memory';

const cheatSetGold = (gold: number): boolean => withMemory(false, () => setGold(cheatWrite, gold));

export { cheatSetGold };
