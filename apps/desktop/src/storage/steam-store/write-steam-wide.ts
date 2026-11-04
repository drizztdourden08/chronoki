/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { platformFiles } from '../platform-files';
import { notifySteamDataChanged } from './notify-steam-data-changed';
import { removeIfThere } from './remove-if-there';
import { STEAM_DIR, STEAM_MARKER_FILE, STEAM_WIDE_FILE, STEAM_WIDE_VERSION } from './steam-store.constants';
import type { SteamMarker, SteamSource } from './steam-store.type';

const writeSteamWide = async (wide: Uint8Array, source: SteamSource, files: FileStore = platformFiles()): Promise<void> => {
  const marker: SteamMarker = { version: STEAM_WIDE_VERSION, sourceName: source.name, sourceBytes: source.bytes, builtAt: new Date().toISOString() };
  await files.mkdir(STEAM_DIR);
  await removeIfThere(files, STEAM_MARKER_FILE);
  await files.writeBytes(STEAM_WIDE_FILE, wide);
  await files.writeText(STEAM_MARKER_FILE, JSON.stringify(marker));
  notifySteamDataChanged();
};

export { writeSteamWide };
