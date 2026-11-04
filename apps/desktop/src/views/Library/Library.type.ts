/* @layer renderer-components @kind types */
interface LibraryRom {
  romFile: string;
  label: string;
  ready: boolean;
  assetBytes: number | null;
}

interface LibraryImportResult {
  success: boolean;
  message: string;
}

export type { LibraryImportResult, LibraryRom };
