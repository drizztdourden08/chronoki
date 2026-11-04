/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { runExtractStep } from '../extraction-client';
import { platformFiles } from '../platform-files';
import { readableError } from './readable-error';
import type { SteamImportResult } from './steam-store.type';
import { storeBuiltWide } from './store-built-wide';

const importSteamArchive = async (file: File, files: FileStore = platformFiles()): Promise<SteamImportResult> => {
  try {
    const wide = await runExtractStep<'steam', Uint8Array>({ step: 'steam', title: 'Reading your Steam data', subject: file.name, input: { file } });
    return await storeBuiltWide(wide, { name: file.name, bytes: file.size }, files);
  } catch (err) {
    return { success: false, error: readableError(err) };
  }
};

export { importSteamArchive };
