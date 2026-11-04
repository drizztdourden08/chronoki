/* @layer renderer-components @kind constants */
const ROM_ACCEPT = ['.sfc', '.smc'];

const ROMS_TEXT = {
  importTitle: 'Import ROM',
  importHint: 'ChronoKi contains no game data. Add your own legally obtained Chrono Trigger ROM; it stays on this device.',
  dropLabel: 'Drop your Chrono Trigger ROM here',
  dropHint: 'A .sfc or .smc file',
  listTitle: 'Imported ROMs',
  listLabel: 'ROM manager',
  empty: 'No ROM added yet',
  noSelection: 'Select a ROM to view details',
  noInfo: 'ROM info not available',
  working: 'Importing the ROM and building the game assets. This can take a while.',
  rebuilding: 'Building the game assets. This can take a while.',
  imported: 'ROM added and the game assets are ready.',
  rebuilt: 'The game assets are rebuilt.',
  ready: 'Ready',
  notBuilt: 'Assets not built',
  deleteLabel: 'Delete',
  rebuild: 'Rebuild assets',
  build: 'Build assets',
};

const VERDICT_LABEL = {
  known: 'Recognised dump',
  unknown: 'Unrecognised dump',
  refused: 'Not accepted',
};

const VERDICT_TONE = { known: 'success', unknown: 'warning', refused: 'danger' } as const;

export { ROM_ACCEPT, ROMS_TEXT, VERDICT_LABEL, VERDICT_TONE };
