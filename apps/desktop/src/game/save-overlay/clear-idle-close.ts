/* @layer bridge-wasm @kind logic */
import { idleTimer } from './idle-close.state';

const clearIdleClose = (): void => {
  clearTimeout(idleTimer.id);
  idleTimer.id = undefined;
};

export { clearIdleClose };
