/* @layer renderer-lib @kind logic */
import { MSUL_MANIFEST_NAME } from '@drizztdourden08/brock-msu';
import { errorMessage } from '../error-message';
import { installClassicSet } from './install-classic-set';
import { installMsulBytes } from './install-msul-bytes';
import { isZipBytes } from './is-zip-bytes';
import type { MsuImportProgress, MsuImportResult, MsuSourceFile } from './msu-store.type';
import { stemOf } from './stem-of';
import { unzipFiles } from './unzip-files';

const importZip = async (source: MsuSourceFile, onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  const entries = await unzipFiles(source.bytes);
  if (entries.some((entry) => entry.name === MSUL_MANIFEST_NAME)) return installMsulBytes(source.bytes, stemOf(source.name), onProgress);
  return installClassicSet(stemOf(source.name), entries, onProgress);
};

const importMsuBytes = async (source: MsuSourceFile, onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  try {
    if (/\.msul$/i.test(source.name)) return await installMsulBytes(source.bytes, stemOf(source.name), onProgress);
    if (isZipBytes(source.bytes)) return await importZip(source, onProgress);
    return await installClassicSet(stemOf(source.name), [source], onProgress);
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { importMsuBytes };
