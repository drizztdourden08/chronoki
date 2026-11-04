/* @layer electron-main @kind constants */
const SKIPPED_FOLDER_NAMES: readonly string[] = ['windows', '$recycle.bin', 'system volume information', 'node_modules'];

const STEAM_ROOT_NAMES: readonly string[] = ['steam', 'steamlibrary'];

const STEAMAPPS_DIR = 'steamapps';

const LIBRARY_FILE = 'libraryfolders.vdf';

const GAME_PARTS: readonly string[] = ['steamapps', 'common', 'Chrono Trigger'];

const ARCHIVE_NAME = 'resources.bin';

const MAX_FOLDER_VISITS = 20000;

const DRIVE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const REGISTRY_QUERIES: readonly { key: string; value: string }[] = [
  { key: 'HKCU\\Software\\Valve\\Steam', value: 'SteamPath' },
  { key: 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam', value: 'InstallPath' },
];

export { ARCHIVE_NAME, DRIVE_LETTERS, GAME_PARTS, LIBRARY_FILE, MAX_FOLDER_VISITS, REGISTRY_QUERIES, SKIPPED_FOLDER_NAMES, STEAMAPPS_DIR, STEAM_ROOT_NAMES };
