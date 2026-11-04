/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { platformFiles } from '../platform-files';
import { notifySteamDataChanged } from './notify-steam-data-changed';
import { removeIfThere } from './remove-if-there';
import { STEAM_MARKER_FILE, STEAM_WIDE_FILE } from './steam-store.constants';

const removeSteamData = async (files: FileStore = platformFiles()): Promise<void> => {
  await removeIfThere(files, STEAM_MARKER_FILE);
  await removeIfThere(files, STEAM_WIDE_FILE);
  notifySteamDataChanged();
};

export { removeSteamData };
