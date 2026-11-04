/* @layer renderer-app @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { DEFAULT_PROFILE_MODE } from './storage/profiles.constants';
import { savesDir } from './storage/saves-dir';

const chronokiProfileHooks: ProfileStoreHooks = {
  build: ({ romFile, mode }) => ({ romFile: romFile ?? '', mode: mode ?? DEFAULT_PROFILE_MODE }),
  patchable: ['romFile', 'mode'],
  onCreate: async (profile, files) => {
    await files.mkdir(savesDir(profile.id));
  },
};

export { chronokiProfileHooks };
