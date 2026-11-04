/* @layer renderer-app @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { savesDir } from './storage/saves-dir';

const chronokiProfileHooks: ProfileStoreHooks = {
  build: ({ romFile }) => ({ romFile: romFile ?? '' }),
  patchable: ['romFile'],
  onCreate: async (profile, files) => {
    await files.mkdir(savesDir(profile.id));
  },
};

export { chronokiProfileHooks };
