/* @layer electron-main @kind logic */
import { STEAMAPPS_DIR, STEAM_ROOT_NAMES } from './steam-detect.constants';
import type { DirItem } from './steam-detect.type';

const isSteamRoot = (name: string, items: readonly DirItem[]): boolean =>
  STEAM_ROOT_NAMES.includes(name.toLowerCase()) || items.some((item) => item.isDirectory && item.name.toLowerCase() === STEAMAPPS_DIR);

export { isSteamRoot };
