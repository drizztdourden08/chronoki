/* @layer bridge-wasm @kind logic */
import { giveCtItem } from '@chronoki/game-core';
import type { CtGiveAction, CtGiveResult } from '@chronoki/game-core';
import { cheatWrite } from '../cheats/cheat-write';
import { withMemory } from '../cheats/with-memory';

const giveCtAction = (action: CtGiveAction): CtGiveResult =>
  withMemory<CtGiveResult>('retry', (heap, ptr) => giveCtItem({ heap, ptr, write: cheatWrite }, action));

export { giveCtAction };
