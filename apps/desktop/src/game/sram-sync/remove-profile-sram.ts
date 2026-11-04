/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { sramPathOf } from './sram-paths';

const removeProfileSram = async (files: FileStore, profileId: string): Promise<void> => {
  const path = sramPathOf(profileId);
  if (await files.exists(path)) await files.remove(path);
};

export { removeProfileSram };
