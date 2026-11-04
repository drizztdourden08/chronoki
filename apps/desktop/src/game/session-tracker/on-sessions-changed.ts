/* @layer bridge-wasm @kind logic */
import { sessionsListeners } from './sessions-listeners';

const onSessionsChanged = (listener: () => void): (() => void) => {
  sessionsListeners.add(listener);
  return () => { sessionsListeners.delete(listener); };
};

export { onSessionsChanged };
