/* @layer electron-main @kind logic */
import { win32 } from 'node:path';
import { parseLibraryFolders } from './parse-library-folders';
import { LIBRARY_FILE, STEAMAPPS_DIR } from './steam-detect.constants';
import type { ScanFs } from './steam-detect.type';

const libraryRootsOf = async (steamRoot: string, fs: ScanFs): Promise<string[]> => {
  const vdf = await fs.readText(win32.join(steamRoot, STEAMAPPS_DIR, LIBRARY_FILE));
  return vdf ? parseLibraryFolders(vdf) : [];
};

export { libraryRootsOf };
