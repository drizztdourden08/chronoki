/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';

const removeIfThere = async (files: FileStore, path: string): Promise<void> => {
  if (await files.exists(path)) await files.remove(path);
};

export { removeIfThere };
