/* @layer renderer-components @kind constants */
const ROM_ACCEPT = ['.sfc', '.smc', '.zip', '.7z', '.rar'];

const ROMS_TEXT = {
  importTitle: 'Import ROM',
  importHint: 'ChronoKi contains no game data. Add your own legally obtained Chrono Trigger ROM; it stays on this device.',
  placeholder: 'Paste ROM download URL...',
  dropLabel: 'Drop your Chrono Trigger ROM here',
  dropHint: '.sfc, .smc, or compressed archive (.zip, .7z, .rar)',
  listTitle: 'Imported ROMs and supplements',
  listLabel: 'ROM manager',
  empty: 'No ROM added yet',
  noSelection: 'Select a ROM to view details',
  noInfo: 'ROM info not available',
  loading: 'Loading...',
  noFile: 'No file selected',
  importFailed: 'Import failed',
  downloadFailed: 'Download failed',
  buildFailed: 'Building the assets failed',
  alreadyImported: 'ROM already imported',
  rebuilding: 'Building the game assets. This can take a while.',
  imported: 'ROM added and the game assets are ready.',
  rebuilt: 'The game assets are rebuilt.',
  kindBadge: 'Base cartridge',
  assetsExtracted: 'Assets extracted',
  noAssets: 'No assets',
  extracted: 'Extracted',
  extracting: 'Extracting...',
  extractAssets: 'Extract Assets',
  spritesToo: 'Extract sprites too',
  spritesRunning: 'Extracting sprites...',
  spritesFailed: 'Sprite extraction failed',
  rowCheck: 'Check',
  rowGame: 'Game',
  rowSize: 'Size',
  rowHash: 'Hash',
  rowAdded: 'Added',
  rowModified: 'Modified',
  rowAssets: 'Assets',
  deleteLabel: 'Delete',
  deleteTitle: 'Delete ROM',
  deleteMessage: 'This removes the imported ROM and its built assets:',
  rebuild: 'Rebuild assets',
  build: 'Build assets',
};

const STEAM_ACCEPT = ['.bin'];

const STEAM_TEXT = {
  title: 'Steam data (optional)',
  hint: 'Optional. If you own Chrono Trigger on Steam, ChronoKi can read its resources.bin once to build the extra Steam margin art. Nothing is uploaded and resources.bin stays where it is; only the derived margin file is kept on this device.',
  unlocks: 'Unlocks the Steam margins option.',
  dropLabel: 'Drop resources.bin here',
  dropHint: 'From the Chrono Trigger Steam folder',
  scanning: 'Looking for Chrono Trigger on your drives...',
  found: 'Found:',
  notFound: 'Not found. Use Browse or drop resources.bin below.',
  cancelled: 'Search stopped. Use Browse, drop resources.bin below, or search again.',
  import: 'Import',
  browse: 'Browse',
  cancel: 'Stop searching',
  rescan: 'Search again',
  working: 'Reading your Steam data. This can take a while.',
  imported: 'Steam data is ready.',
  removeLabel: 'Remove',
  removeTitle: 'Remove Steam data',
  removeMessage: 'This removes the margin art built from your Steam copy. Your Steam files are not touched.',
  importedOn: 'Imported',
  source: 'From',
  noData: 'No Steam data imported.',
};

const VERDICT_LABEL = {
  known: 'Recognised dump',
  unknown: 'Unrecognised dump',
  refused: 'Not accepted',
};

const VERDICT_TONE = { known: 'success', unknown: 'warning', refused: 'danger' } as const;

export { ROM_ACCEPT, ROMS_TEXT, STEAM_ACCEPT, STEAM_TEXT, VERDICT_LABEL, VERDICT_TONE };
