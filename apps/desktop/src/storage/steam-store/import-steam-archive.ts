/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { errorMessage } from '../error-message';
import { runExtractStep } from '../extraction-client';
import { platformFiles } from '../platform-files';
import { readWideHeader } from './read-wide-header';
import { NOT_ARCHIVE_ERROR, NO_MARGINS_ERROR, STEAM_WIDE_VERSION } from './steam-store.constants';
import type { SteamImportResult } from './steam-store.type';
import { writeSteamWide } from './write-steam-wide';

const readableError = (err: unknown): string => {
  const message = errorMessage(err);
  return message.includes('ARC1') ? NOT_ARCHIVE_ERROR : message;
};

const importSteamArchive = async (file: File, files: FileStore = platformFiles()): Promise<SteamImportResult> => {
  try {
    const wide = await runExtractStep<'steam', Uint8Array>({ step: 'steam', title: 'Reading your Steam data', subject: file.name, input: { file } });
    const header = readWideHeader(wide);
    if (header?.version !== STEAM_WIDE_VERSION || header.margins === 0) return { success: false, error: NO_MARGINS_ERROR };
    await writeSteamWide(wide, { name: file.name, bytes: file.size }, files);
    return { success: true };
  } catch (err) {
    return { success: false, error: readableError(err) };
  }
};

export { importSteamArchive };
