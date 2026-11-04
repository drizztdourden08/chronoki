/* @layer shared-storage @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CreateProfileOptions, Profile } from '@app/profiles/types';
import { newId, writeJson } from '@drizztdourden08/brock-core';
import { configFile } from './config-file';
import { profileFile } from './profile-file';
import { savesDir } from './saves-dir';

const createProfile = async (files: FileStore, opts: CreateProfileOptions): Promise<Profile> => {
  const { name, romFile, initialConfig = {} } = opts;
  const id = newId();
  const now = Date.now();
  const profile: Profile = { id, name, romFile, created: now, lastPlayed: now };
  await files.mkdir(savesDir(id));
  await writeJson(files, profileFile(id), profile);
  await writeJson(files, configFile(id), initialConfig);
  return profile;
};

export { createProfile };
