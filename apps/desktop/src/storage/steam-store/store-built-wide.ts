/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { readWideHeader } from './read-wide-header';
import { NO_MARGINS_ERROR, STEAM_WIDE_VERSION } from './steam-store.constants';
import type { SteamImportResult, SteamSource } from './steam-store.type';
import { writeSteamWide } from './write-steam-wide';

const storeBuiltWide = async (wide: Uint8Array, source: SteamSource, files: FileStore): Promise<SteamImportResult> => {
  const header = readWideHeader(wide);
  if (header?.version !== STEAM_WIDE_VERSION || header.margins === 0) return { success: false, error: NO_MARGINS_ERROR };
  await writeSteamWide(wide, source, files);
  return { success: true };
};

export { storeBuiltWide };
