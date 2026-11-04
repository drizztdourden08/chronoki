/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { migrateLegacyMode } from '@app/profiles/storage/migrate-legacy-mode';
import { platformFiles } from '@app/storage/platform-files';

export default defineBootTask({
  label: 'Carrying profile modes into settings',
  after: ['settings'],
  run: async ({ report, profile }) => {
    await migrateLegacyMode(platformFiles(), profile?.id ?? null).catch(() => undefined);
    report(1);
  },
});
