/* @layer renderer-lib @kind logic */
import { importMsuBytes } from './import-msu-bytes';
import type { MsuImportProgress, MsuImportResult } from './msu-store.type';

const importMsuFile = async (file: File, onProgress?: MsuImportProgress): Promise<MsuImportResult> =>
  importMsuBytes({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) }, onProgress);

export { importMsuFile };
