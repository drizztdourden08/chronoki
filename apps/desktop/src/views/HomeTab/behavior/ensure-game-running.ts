/* @layer renderer-components @kind logic */
import { activeGameHolder } from '@app/game/lifecycle/active-game-holder';
import { BOOT_WAIT_MS } from '../HomeTab.constants';
import { whenCoreReady } from './when-core-ready';

const ensureGameRunning = async (isGameRunning: boolean, onStartGame: () => void): Promise<boolean> => {
  if (activeGameHolder.current) return true;
  if (!isGameRunning) onStartGame();
  return whenCoreReady(BOOT_WAIT_MS);
};

export { ensureGameRunning };
