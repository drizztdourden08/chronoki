/* @layer renderer-lib @kind logic */
import type { PlaySession } from '@drizztdourden08/brock-core';
import { readJson, writeJson } from '@drizztdourden08/brock-core';
import { sessionsFile } from '@app/profiles/storage/sessions-file';
import { platformFiles } from '../platform-files';
import { MAX_SESSIONS } from './profile-data.constants';

const saveSession = async (profileId: string, session: PlaySession): Promise<void> => {
  const files = platformFiles();
  const path = sessionsFile(profileId);
  const sessions = await readJson<PlaySession[]>(files, path, []);
  await writeJson(files, path, [...sessions, session].slice(-MAX_SESSIONS));
};

export { saveSession };
