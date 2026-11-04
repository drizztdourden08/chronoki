/* @layer shared-storage @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { PROFILES_DIR } from './profiles.constants';
import { pendingLegacyFlag } from './pending-legacy-flag';
import { writeConfig } from './write-config';

const migrateLegacyMode = async (files: FileStore, skipId: string | null): Promise<void> => {
  for (const id of await files.list(PROFILES_DIR)) {
    const pending = id === skipId ? null : await pendingLegacyFlag(files, id);
    if (pending && pending.config.original !== pending.flag) await writeConfig(files, id, { ...pending.config, original: pending.flag });
  }
};

export { migrateLegacyMode };
