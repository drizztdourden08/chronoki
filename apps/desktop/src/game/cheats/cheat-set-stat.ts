/* @layer bridge-wasm @kind logic */
import { setSheetStat } from '@chronoki/game-core';
import type { SheetStat } from '@chronoki/game-core';
import { cheatWrite } from './cheat-write';
import { withMemory } from './with-memory';

const cheatSetStat = (id: number, stat: SheetStat, value: number): boolean =>
  withMemory(false, () => setSheetStat(cheatWrite, id, stat, value));

export { cheatSetStat };
