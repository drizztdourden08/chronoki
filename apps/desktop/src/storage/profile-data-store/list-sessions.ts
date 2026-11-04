/* @layer renderer-lib @kind logic */
import type { PlaySession } from '@drizztdourden08/brock-core';
import { readJson } from '@drizztdourden08/brock-core';
import { sessionsFile } from '@app/profiles/storage/sessions-file';
import { platformFiles } from '../platform-files';

const listSessions = async (profileId: string): Promise<PlaySession[]> => {
  try {
    const sessions = await readJson<PlaySession[]>(platformFiles(), sessionsFile(profileId), []);
    return [...sessions].sort((a, b) => b.startedAt - a.startedAt);
  } catch {
    return [];
  }
};

export { listSessions };
