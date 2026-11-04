/* @layer shared-storage @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { readJson } from '@drizztdourden08/brock-core';
import { legacyModeFlag } from '../legacy-mode-flag';
import { profileFile } from './profile-file';
import { readConfig } from './read-config';

const pendingLegacyFlag = async (files: FileStore, id: string): Promise<{ flag: boolean; config: Record<string, unknown> } | null> => {
  const profile = await readJson<{ mode?: unknown } | null>(files, profileFile(id), null);
  const flag = legacyModeFlag(profile?.mode);
  const config = await readConfig(files, id);
  return flag === undefined || !config || config.vanillaSafe !== undefined ? null : { flag, config };
};

export { pendingLegacyFlag };
