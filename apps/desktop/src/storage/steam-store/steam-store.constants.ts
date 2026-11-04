/* @layer renderer-lib @kind constants */
const STEAM_DIR = 'steam';

const STEAM_WIDE_FILE = 'steam/ct_wide.dat';

const STEAM_MARKER_FILE = 'steam/steam-data.json';

const STEAM_WIDE_VERSION = 3;

const WIDE_MAGIC = 'CTWD';

const WIDE_HEADER_BYTES = 16;

const NOT_ARCHIVE_ERROR = 'That is not the Steam resources.bin of Chrono Trigger. Pick the resources.bin from the game folder.';

const NO_MARGINS_ERROR = 'That archive did not contain any Steam margin art. Pick the resources.bin from the Chrono Trigger Steam folder.';

const NO_FILE_ERROR = 'No file was chosen.';

export { NOT_ARCHIVE_ERROR, NO_FILE_ERROR, NO_MARGINS_ERROR, STEAM_DIR, STEAM_MARKER_FILE, STEAM_WIDE_FILE, STEAM_WIDE_VERSION, WIDE_HEADER_BYTES, WIDE_MAGIC };
