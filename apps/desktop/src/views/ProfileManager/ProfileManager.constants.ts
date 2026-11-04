/* @layer renderer-components @kind constants */
import type { TabItem } from '@drizztdourden08/tessera/primitives';
import type { ProfileMode } from '@app/profiles/types';

const OVERVIEW_TAB = 'overview';
const SETTINGS_TAB = 'settings';
const DATA_TAB = 'data';

const PROFILE_TABS: TabItem[] = [
  { id: OVERVIEW_TAB, label: 'Overview' },
  { id: SETTINGS_TAB, label: 'Settings' },
  { id: DATA_TAB, label: 'Saves and play' },
];

const MODE_LABELS: Record<ProfileMode, string> = {
  original: 'Original',
  enhanced: 'Modified',
};

const MODE_OPTIONS: { value: ProfileMode; label: string }[] = [
  { value: 'original', label: MODE_LABELS.original },
  { value: 'enhanced', label: MODE_LABELS.enhanced },
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

export { DATA_TAB, MODE_LABELS, MODE_OPTIONS, OVERVIEW_TAB, PROFILE_TABS, PROFILE_TEXT, SETTINGS_TAB };
