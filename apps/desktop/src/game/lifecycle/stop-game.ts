/* @layer bridge-wasm @kind logic */
import { saveStateOnQuit } from '../auto-save/save-state-on-quit';
import { endSession } from '../session-tracker';
import { stopSramSync } from '../sram-sync';
import { activeGameHolder } from './active-game-holder';

const stopGame = async (): Promise<void> => {
  const game = activeGameHolder.current;
  activeGameHolder.current = null;
  if (!game) return;
  await saveStateOnQuit(game);
  await endSession();
  game.unsubscribePause();
  await stopSramSync();
  await game.session.stop();
};

export { stopGame };
