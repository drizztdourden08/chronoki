/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { ASSETS_DIR } from '@app/profiles/storage';
import { romStoreOf } from '../rom-files';

const storeAssets = async (files: FileStore, romFile: string, blob: Uint8Array): Promise<void> => {
  const target = romStoreOf(files).assetFileOf(romFile);
  if (!target) throw new Error('The port declares no asset file.');
  await files.mkdir(ASSETS_DIR);
  await files.writeBytes(target, blob);
};

export { storeAssets };
