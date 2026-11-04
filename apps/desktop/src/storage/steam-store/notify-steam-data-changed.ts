/* @layer renderer-lib @kind logic */
import { steamListeners } from './steam-listeners';

const notifySteamDataChanged = (): void => {
  for (const listener of [...steamListeners]) listener();
};

export { notifySteamDataChanged };
