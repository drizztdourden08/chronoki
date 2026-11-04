/* @layer renderer-components @kind constants */
import type { TabItem } from '@drizztdourden08/tessera/primitives';

const OVERVIEW_TAB = 'overview';
const SETTINGS_TAB = 'settings';
const DATA_TAB = 'data';

const PROFILE_TABS: TabItem[] = [
  { id: OVERVIEW_TAB, label: 'Overview' },
  { id: SETTINGS_TAB, label: 'Settings' },
  { id: DATA_TAB, label: 'Saves and play' },
];

const PROFILE_TEXT = {
  listTitle: 'Profiles',
  listLabel: 'Profile manager',
  empty: 'No profiles yet. Add your ROM in the Library, then create a profile.',
  noRom: 'No ROM selected',
  newProfile: 'New Profile',
  emptyDetail: 'Select a profile. Double-click to open it.',
  open: 'Open profile',
  delete: 'Delete',
} as const;

const NO_PACK_LABEL = 'None';

const PACK_FIELD_HINT = { locked: 'Vanilla Safe is on. Your choice is kept and applies again when it is off.' } as const;

const PACK_IMPORT_TEXT = { button: 'Import folder', title: 'Import a music pack from a folder', progress: 'Importing' } as const;

export { DATA_TAB, PACK_IMPORT_TEXT, NO_PACK_LABEL, OVERVIEW_TAB, PACK_FIELD_HINT, PROFILE_TABS, PROFILE_TEXT, SETTINGS_TAB };
