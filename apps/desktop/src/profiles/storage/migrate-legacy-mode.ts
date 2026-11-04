/* @layer shared-storage @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { readJson } from '@drizztdourden08/brock-core';
import { legacyModeFlag } from '../legacy-mode-flag';
import { PROFILES_DIR } from './profiles.constants';
import { profileFile } from './profile-file';
import { readConfig } from './read-config';
import { writeConfig } from './write-config';

const migrateLegacyMode = async (files: FileStore): Promise<void> => {
  for (const id of await files.list(PROFILES_DIR)) {
    const profile = await readJson<{ mode?: unknown } | null>(files, profileFile(id), null);
    const flag = legacyModeFlag(profile?.mode);
    const config = await readConfig(files, id);
    if (flag === undefined || !config || config.vanillaSafe !== undefined || config.original === flag) continue;
    await writeConfig(files, id, { ...config, original: flag });
  }
};

export { migrateLegacyMode };
