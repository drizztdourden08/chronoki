/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { migrateLegacyMode } from '@app/profiles/storage/migrate-legacy-mode';
import { platformFiles } from '@app/storage/platform-files';

export default defineBootTask({
  label: 'Carrying profile modes into settings',
  run: async ({ report }) => {
    await migrateLegacyMode(platformFiles()).catch(() => undefined);
    report(1);
  },
});
