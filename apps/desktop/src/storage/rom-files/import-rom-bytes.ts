/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { errorMessage } from '../error-message';
import type { ImportPhase } from '../import-job';
import { refusalMessage } from './refusal-message';
import { romStoreOf } from './rom-store-of';
import type { RomBytes, RomImportResult } from './rom-files.type';

const isZip = (bytes: Uint8Array): boolean => bytes[0] === 0x50 && bytes[1] === 0x4b;

const importRomBytes = async (files: FileStore, rom: RomBytes, onPhase?: (phase: ImportPhase) => void): Promise<RomImportResult> => {
  const { fileName, bytes } = rom;
  if (isZip(bytes)) onPhase?.('extract');
  onPhase?.('copy');
  try {
    const imported = await romStoreOf(files).importRom(fileName, bytes);
    if (!imported.ok) return { success: false, romFile: '', error: refusalMessage(imported) };
    return { success: true, romFile: imported.file ?? '', alreadyExists: imported.existed ?? false };
  } catch (err) {
    return { success: false, romFile: '', error: errorMessage(err) };
  }
};

export { importRomBytes };
