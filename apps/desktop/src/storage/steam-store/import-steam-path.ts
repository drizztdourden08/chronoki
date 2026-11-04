/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { buildCtWide } from '@chronoki/asset-extraction';
import { requireAppApi } from '@app/ipc/require-app-api';
import type { SteamPick } from '@app/ipc';
import { platformFiles } from '../platform-files';
import { readableError } from './readable-error';
import type { SteamImportResult } from './steam-store.type';
import { storeBuiltWide } from './store-built-wide';

const nameOf = (path: string): string => path.slice(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1);

const importSteamPath = async ({ path, size }: SteamPick, files: FileStore = platformFiles()): Promise<SteamImportResult> => {
  try {
    const api = requireAppApi();
    const wide = await buildCtWide({ read: (offset, length) => api.steamReadRange(path, offset, length) });
    return await storeBuiltWide(wide, { name: nameOf(path), bytes: size }, files);
  } catch (err) {
    return { success: false, error: readableError(err) };
  }
};

export { importSteamPath };
