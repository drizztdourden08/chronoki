/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { pendulumFile } from './pendulum-file';

const removeTitlePendulum = async (files: FileStore, romFile: string): Promise<void> => {
  const path = pendulumFile(romFile);
  if (await files.exists(path)) await files.remove(path);
};

export { removeTitlePendulum };
