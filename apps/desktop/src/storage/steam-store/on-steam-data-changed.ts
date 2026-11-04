/* @layer renderer-lib @kind logic */
import { steamListeners } from './steam-listeners';

const onSteamDataChanged = (listener: () => void): (() => void) => {
  steamListeners.add(listener);
  return () => {
    steamListeners.delete(listener);
  };
};

export { onSteamDataChanged };
