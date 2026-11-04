/* @layer renderer-components @kind logic */
import type { LibraryImportResult } from '../Library.type';
import { LIBRARY_TEXT } from '../Library.constants';

// TODO(P3): hand the file to the port-kit ROM store and @chronoki/asset-extraction; the scaffold only reports that it is not wired.
const importRom = async (files: File[]): Promise<LibraryImportResult> =>
  ({ success: false, message: files.length === 0 ? LIBRARY_TEXT.empty : LIBRARY_TEXT.pending });

export { importRom };
