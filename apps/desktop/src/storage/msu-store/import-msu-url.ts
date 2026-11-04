/* @layer renderer-lib @kind logic */
import { errorMessage } from '../error-message';
import { importMsuBytes } from './import-msu-bytes';
import type { MsuImportProgress, MsuImportResult } from './msu-store.type';

const nameOfUrl = (url: string): string => decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '') || 'pack.zip';

const importMsuUrl = async (url: string, onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return { success: false, error: `Download failed: HTTP ${res.status}` };
    return await importMsuBytes({ name: nameOfUrl(url), bytes: new Uint8Array(await res.arrayBuffer()) }, onProgress);
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { importMsuUrl };
