/* @layer renderer-app @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { savesDir } from './storage/saves-dir';

const chronokiProfileHooks: ProfileStoreHooks = {
  build: ({ romFile, msuPack }) => ({ romFile: romFile ?? '', ...(msuPack ? { msuPack } : {}) }),
  patchable: ['romFile', 'msuPack'],
  onCreate: async (profile, files) => {
    await files.mkdir(savesDir(profile.id));
  },
};

export { chronokiProfileHooks };
