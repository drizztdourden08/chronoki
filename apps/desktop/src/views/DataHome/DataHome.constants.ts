/* @layer renderer-components @kind constants */
import type { DataSectionGroup } from '@app/compounds/DataSections';

const DATA_BUCKET = 'data';

const DATA_SECTION_GROUPS: readonly DataSectionGroup[] = [
  {
    id: 'library',
    label: 'Library',
    items: [
      { id: 'profiles', title: 'Profiles', icon: 'users', description: 'Create, open and delete profiles.' },
      { id: 'roms', title: 'ROMs', icon: 'gamepad-2', description: 'Import a ROM and extract its assets.' },
    ],
  },
  {
    id: 'folder',
    label: 'Data folder',
    items: [
      { id: 'storage', title: 'Storage', icon: 'hard-drive', description: 'See folder sizes, clean up old files, and export or import your data.' },
    ],
  },
];

export { DATA_BUCKET, DATA_SECTION_GROUPS };
