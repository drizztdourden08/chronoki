/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { sramBackupPathOf } from './sram-backup-path-of';

const restoreBackupToSram = async (files: FileStore, profileId: string, backup: Uint8Array | null): Promise<void> => {
  const path = sramBackupPathOf(profileId);
  if (backup) await files.writeBytes(path, backup);
  else if (await files.exists(path)) await files.remove(path);
};

export { restoreBackupToSram };
