/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { platformFiles } from '../platform-files';
import { parseSteamMarker } from './parse-steam-marker';
import { STEAM_MARKER_FILE } from './steam-store.constants';
import type { SteamMarker } from './steam-store.type';

const readSteamMarker = async (files: FileStore = platformFiles()): Promise<SteamMarker | null> => parseSteamMarker(await files.readText(STEAM_MARKER_FILE));

export { readSteamMarker };
