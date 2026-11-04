/* @layer renderer-lib @kind logic */
import { errorMessage } from '../error-message';
import { installClassicSet } from './install-classic-set';
import { DEFAULT_PACK_NAME } from './msu-store.constants';
import type { MsuImportProgress, MsuImportResult, MsuSourceFile } from './msu-store.type';

const folderNameOf = (files: File[]): string => files[0]?.webkitRelativePath.split('/')[0] || DEFAULT_PACK_NAME;

const toSource = async (file: File): Promise<MsuSourceFile> => ({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) });

const importMsuFolder = async (files: File[], onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  try {
    return await installClassicSet(folderNameOf(files), await Promise.all(files.map(toSource)), onProgress);
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { importMsuFolder };
