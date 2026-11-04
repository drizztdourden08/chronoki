/* @layer renderer-lib @kind logic */
import type { FileStore, PlaySession } from '@drizztdourden08/brock-core';
import { readJson } from '@drizztdourden08/brock-core';
import { sessionsFile } from '@app/profiles/storage/sessions-file';
import { savesDir } from '@app/profiles/storage/saves-dir';
import { sramPathOf } from '@app/game/sram-sync/sram-path-of';
import { platformFiles } from '../platform-files';
import type { ProfileData } from './profile-data.type';

const orElse = async <T>(read: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await read();
  } catch {
    return fallback;
  }
};

const saveSizes = async (files: FileStore, profileId: string): Promise<number[]> => {
  const dir = savesDir(profileId);
  const names = await files.list(dir);
  const stats = await Promise.all(names.map((name) => files.stat(`${dir}/${name}`)));
  return stats.map((stat) => stat?.bytes ?? 0);
};

const loadProfileData = async (profileId: string): Promise<ProfileData> => {
  const files = platformFiles();
  const [sizes, sram, sessions] = await Promise.all([
    orElse(() => saveSizes(files, profileId), []),
    orElse(() => files.stat(sramPathOf(profileId)), null),
    orElse(() => readJson<PlaySession[]>(files, sessionsFile(profileId), []), []),
  ]);
  return { saveFiles: sizes.length, saveBytes: sizes.reduce((sum, size) => sum + size, 0), sramBytes: sram?.bytes ?? null, sessions };
};

export { loadProfileData };
