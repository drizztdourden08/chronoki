/* @layer electron-main @kind logic */
import { libraryRootsOf } from './library-roots-of';
import type { ScanFs } from './steam-detect.type';

const knownSteamRoots = async (registryRoots: readonly string[], fs: ScanFs): Promise<string[]> => {
  const libraries = await Promise.all(registryRoots.map((root) => libraryRootsOf(root, fs)));
  return [...new Set([...registryRoots, ...libraries.flat()])];
};

export { knownSteamRoots };
