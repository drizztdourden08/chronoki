/* @layer renderer-lib @kind types */
interface RomBytes {
  fileName: string;
  bytes: Uint8Array;
}

interface RomImportResult {
  success: boolean;
  romFile: string;
  alreadyExists?: boolean;
  error?: string;
}

export type { RomBytes, RomImportResult };
