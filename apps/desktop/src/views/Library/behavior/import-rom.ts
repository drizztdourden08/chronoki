/* @layer renderer-components @kind logic */
import type { LibraryImportResult } from '../Library.type';
import { LIBRARY_TEXT } from '../Library.constants';

const importRom = (files: File[]): Promise<LibraryImportResult> =>
  Promise.resolve({ success: false, message: files.length === 0 ? LIBRARY_TEXT.empty : LIBRARY_TEXT.pending });

export { importRom };
