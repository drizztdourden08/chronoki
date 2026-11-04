/* @layer renderer-components @kind logic */
import { activeGameHolder } from '@app/game/lifecycle/active-game-holder';
import { BOOT_POLL_MS } from '../HomeTab.constants';

const whenCoreReady = async (timeoutMs: number): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  while (!activeGameHolder.current && Date.now() < deadline) {
    await new Promise<void>((resolve) => { setTimeout(resolve, BOOT_POLL_MS); });
  }
  return activeGameHolder.current !== null;
};

export { whenCoreReady };
