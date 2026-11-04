/* @layer shared-storage @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CreateProfileOptions, Profile } from '@app/profiles/types';
import { newId, writeJson } from '@drizztdourden08/brock-core';
import { savesDir } from '@chronoki/game-core/save-paths';
import { configFile } from './config-file';
import { DEFAULT_PROFILE_MODE } from './profiles.constants';
import { profileFile } from './profile-file';

const createProfile = async (files: FileStore, opts: CreateProfileOptions): Promise<Profile> => {
  const { name, romFile, mode = DEFAULT_PROFILE_MODE } = opts;
  const id = newId();
  const now = Date.now();
  const profile: Profile = { id, name, romFile, created: now, lastPlayed: now, mode };
  await files.mkdir(savesDir(id));
  await writeJson(files, profileFile(id), profile);
  await writeJson(files, configFile(id), {});
  return profile;
};

export { createProfile };
