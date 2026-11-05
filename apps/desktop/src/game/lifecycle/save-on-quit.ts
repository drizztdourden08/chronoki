/* @layer bridge-wasm @kind logic */
import { saveStateOnQuit } from '../auto-save/save-state-on-quit';
import { flushSramSync } from '../sram-sync';
import { activeGameHolder } from './active-game-holder';

const saveOnQuit = async (): Promise<void> => {
  await flushSramSync();
  const game = activeGameHolder.current;
  if (game) await saveStateOnQuit(game);
};

export { saveOnQuit };
