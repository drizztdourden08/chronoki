/* @layer renderer-components @kind types */
interface LibraryRom {
  romFile: string;
  bytes?: number;
}

interface LibraryImportResult {
  success: boolean;
  message: string;
}

export type { LibraryImportResult, LibraryRom };
