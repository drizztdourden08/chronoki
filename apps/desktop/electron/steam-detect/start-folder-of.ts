/* @layer electron-main @kind logic */
import { existsSync } from 'node:fs';
import { win32 } from 'node:path';
import { GAME_PARTS } from './steam-detect.constants';
import { registrySteamRoots } from './registry-steam-roots';

const startFolderOf = async (): Promise<string | undefined> => {
  const roots = await registrySteamRoots();
  const folders = roots.flatMap((root) => [win32.join(root, ...GAME_PARTS), win32.join(root, ...GAME_PARTS.slice(0, 2)), win32.join(root)]);
  return folders.find((folder) => existsSync(folder));
};

export { startFolderOf };
