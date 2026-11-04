/* @layer renderer-lib @kind logic */
import { hasSteamData } from './has-steam-data';
import { steamFlagHolder } from './steam-flag-holder';

const refreshSteamFlag = async (): Promise<boolean> => {
  steamFlagHolder.imported = await hasSteamData().catch(() => false);
  return steamFlagHolder.imported;
};

export { refreshSteamFlag };
