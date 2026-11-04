/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { platformFiles } from '../platform-files';
import { readSteamMarker } from './read-steam-marker';
import { STEAM_WIDE_FILE } from './steam-store.constants';

const hasSteamData = async (files: FileStore = platformFiles()): Promise<boolean> => {
  if (!(await readSteamMarker(files))) return false;
  return files.exists(STEAM_WIDE_FILE);
};

export { hasSteamData };
