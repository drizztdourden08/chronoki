/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { platformFiles } from '../platform-files';
import { hasSteamData } from './has-steam-data';
import { STEAM_WIDE_FILE } from './steam-store.constants';

const readSteamWide = async (files: FileStore = platformFiles()): Promise<Uint8Array | null> => {
  if (!(await hasSteamData(files))) return null;
  const bytes = await files.readBytes(STEAM_WIDE_FILE);
  return bytes && bytes.length > 0 ? bytes : null;
};

export { readSteamWide };
