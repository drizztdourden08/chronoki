/* @layer bridge-wasm @kind logic */
import { stopSramSync } from '../sram-sync';
import { activeGameHolder } from './active-game-holder';
import type { ActiveGame } from './active-game.type';

const haltGame = async (game: ActiveGame): Promise<void> => {
  if (activeGameHolder.current === game) activeGameHolder.current = null;
  game.unsubscribePause();
  await stopSramSync();
  await game.session.stop();
};

export { haltGame };
