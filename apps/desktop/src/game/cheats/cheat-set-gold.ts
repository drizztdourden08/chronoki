/* @layer bridge-wasm @kind logic */
import { setGold } from '@chronoki/game-core';
import { cheatWrite } from './cheat-write';
import { withMemory } from './with-memory';

const cheatSetGold = (gold: number): boolean => withMemory(false, () => setGold(cheatWrite, gold));

export { cheatSetGold };
