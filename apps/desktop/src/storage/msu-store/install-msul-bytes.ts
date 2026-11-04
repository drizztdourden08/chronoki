/* @layer renderer-lib @kind logic */
import { installMsulPack } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { chronokiMsuConfig } from './chronoki-msu-config';
import type { MsuImportProgress, MsuImportResult } from './msu-store.type';

const installMsulBytes = async (bytes: Uint8Array, desiredName?: string, onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  const result = await installMsulPack(chronokiMsuConfig, platformFiles(), bytes, { desiredName, onProgress });
  return { success: true, pack: result.pack, fileCount: result.fileCount };
};

export { installMsulBytes };
