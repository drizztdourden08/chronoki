/* @layer bridge-wasm @kind logic */
import { stopSramSync } from '../sram-sync';
import { activeGameHolder } from './active-game-holder';

const stopGame = async (): Promise<void> => {
  const game = activeGameHolder.current;
  activeGameHolder.current = null;
  if (!game) return;
  game.unsubscribePause();
  await stopSramSync();
  await game.session.stop();
};

export { stopGame };
