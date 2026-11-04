/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { romStoreOf } from './rom-store-of';

const deleteRomFile = async (files: FileStore, romFile: string): Promise<void> => {
  await romStoreOf(files).remove(romFile);
};

export { deleteRomFile };
